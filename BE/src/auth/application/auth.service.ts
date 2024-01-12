import { Inject, Injectable } from '@nestjs/common';
import { OauthHandler } from './oauth-handler';
import { UserRepository } from '../../users/entities/user.repository';
import { User } from '../../users/domain/user.domain';
import { AppleLoginRequest } from '../dto/apple-login-request.dto';
import { UserCodeGenerator } from './user-code-generator';
import { Transactional } from '../../config/transaction-manager';
import { JwtUtils } from './jwt-utils';
import { JwtClaim, JwtRolePayloads } from '../index';
import { AppleLoginResponse } from '../dto/apple-login-response.dto';
import { UserDto } from '../../users/dto/user.dto';
import { RefreshAuthRequestDto } from '../dto/refresh-auth-request.dto';
import { RefreshAuthResponseDto } from '../dto/refresh-auth-response.dto';
import { RefreshTokenNotFoundException } from '../exception/refresh-token-not-found.exception';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { AvatarHolder } from './avatar.holder';
import { RevokeAppleAuthRequest } from '../dto/revoke-apple-auth-request.dto';
import { RevokeAppleAuthResponse } from '../dto/revoke-apple-auth-response.dto';
import { RevokeRequestFailException } from '../exception/revoke-request-fail.exception';
import { InvalidIdentifierException } from '../exception/invalid-identifier.exception';
import { GroupService } from '../../group/group/application/group.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(CACHE_MANAGER) private refreshTokenStore: Cache,
    private readonly usersRepository: UserRepository,
    private readonly oauthHandler: OauthHandler,
    private readonly userCodeGenerator: UserCodeGenerator,
    private readonly jwtUtils: JwtUtils,
    private readonly avatarHolder: AvatarHolder,
    private readonly groupService: GroupService,
  ) {}

  @Transactional()
  async appleLogin(
    appleLoginRequest: AppleLoginRequest,
  ): Promise<AppleLoginResponse> {
    const userIdentifier = await this.oauthHandler.getUserIdentifier(
      appleLoginRequest.identityToken,
    );
    const user =
      (await this.usersRepository.findOneByUserIdentifierWithRoles(
        userIdentifier,
      )) || (await this.registerUser(userIdentifier));

    const now = new Date();
    const claim: JwtRolePayloads = {
      userCode: user.userCode,
      roles: user.roles,
    };
    const accessToken = this.jwtUtils.createToken(claim, now);
    const refreshToken = this.jwtUtils.createRefreshToken(claim, now);
    await this.refreshTokenStore.set(user.userCode, refreshToken);
    return new AppleLoginResponse(
      UserDto.from(user),
      accessToken,
      refreshToken,
    );
  }

  private async registerUser(userIdentifier: string): Promise<User> {
    const newUser = User.from(userIdentifier);
    const userCode = await this.userCodeGenerator.generate();
    newUser.assignUserCode(userCode);
    newUser.assignAvatar(this.avatarHolder.getUrl());
    return await this.usersRepository.saveUser(newUser);
  }

  async refresh(user: User, refreshAuthRequestDto: RefreshAuthRequestDto) {
    const refreshToken = refreshAuthRequestDto.refreshToken;
    const token = await this.refreshTokenStore.get(user.userCode);
    if (!token) {
      throw new RefreshTokenNotFoundException();
    }
    this.jwtUtils.validateRefreshToken(refreshToken);
    const claim: JwtClaim = { userCode: user.userCode };
    const accessToken = this.jwtUtils.createToken(claim, new Date());
    return new RefreshAuthResponseDto(UserDto.from(user), accessToken);
  }

  @Transactional()
  async revoke(user: User, revokeAuthRequest: RevokeAppleAuthRequest) {
    const requestUserIdentifier = await this.oauthHandler.getUserIdentifier(
      revokeAuthRequest.identityToken,
    );
    if (user.userIdentifier !== requestUserIdentifier)
      throw new InvalidIdentifierException();

    // TODO : 그룹 탈퇴 로직을 서비스 하위 레이어로 분리해서 AuthService, GroupService 에서 해당 레이어를 참조하는 방식으로 추후에 개선 필요
    await this.groupService.removeUserFromAllGroup(user);

    const authorizationCode = revokeAuthRequest.authorizationCode;

    const revokeResponse =
      await this.oauthHandler.revokeUser(authorizationCode);
    if (revokeResponse.status !== 200) throw new RevokeRequestFailException();

    await this.usersRepository.repository.delete(user.id);
    return new RevokeAppleAuthResponse(user.userCode);
  }
}
