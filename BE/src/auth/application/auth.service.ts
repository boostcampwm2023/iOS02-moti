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

@Injectable()
export class AuthService {
  constructor(
    @Inject(CACHE_MANAGER) private refreshTokenStore: Cache,
    private readonly usersRepository: UserRepository,
    private readonly oauthHandler: OauthHandler,
    private readonly userCodeGenerator: UserCodeGenerator,
    private readonly jwtUtils: JwtUtils,
    private readonly avatarHolder: AvatarHolder,
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
}
