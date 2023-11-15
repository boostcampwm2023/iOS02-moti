import { Injectable } from '@nestjs/common';
import { OauthHandler } from './oauth-handler';
import { UserRepository } from '../../users/entities/user.repository';
import { User } from '../../users/domain/user.domain';
import { AppleLoginRequest } from '../dto/apple-login-request.dto';
import { UserCodeGenerator } from './user-code-generator';
import { Transactional } from '../../config/transaction-manager';
import { JwtUtils } from './jwt-utils';
import { JwtClaim } from '../index';
import { AppleLoginResponse } from '../dto/apple-login-response.dto';
import { UserDto } from '../../users/dto/user.dto';
import { RefreshAuthRequestDto } from '../dto/refresh-auth-request.dto';
import { RefreshAuthResponseDto } from '../dto/refresh-auth-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UserRepository,
    private readonly oauthHandler: OauthHandler,
    private readonly userCodeGenerator: UserCodeGenerator,
    private readonly jwtUtils: JwtUtils,
  ) {}

  @Transactional()
  async appleLogin(
    appleLoginRequest: AppleLoginRequest,
  ): Promise<AppleLoginResponse> {
    const userIdentifier = await this.oauthHandler.getUserIdentifier(
      appleLoginRequest.identityToken,
    );
    const user =
      (await this.usersRepository.findOneByUserIdentifier(userIdentifier)) ||
      (await this.registerUser(userIdentifier));

    const now = new Date();
    const claim: JwtClaim = { userCode: user.userCode };
    const accessToken = this.jwtUtils.createToken(claim, now);
    const refreshToken = this.jwtUtils.createRefreshToken(claim, now);
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
    return await this.usersRepository.saveUser(newUser);
  }

  async refresh(user: User, refreshAuthRequestDto: RefreshAuthRequestDto) {
    // Todo redis를 통해 refreshToken 조회해서 유효확인 로직 추가 필요
    const refreshToken = refreshAuthRequestDto.refreshToken;
    this.jwtUtils.validateRefreshToken(refreshToken);
    const payloads = this.jwtUtils.parsePayloads(refreshToken);
    const claim: JwtClaim = { userCode: payloads.userCode };
    const accessToken = this.jwtUtils.createToken(claim, new Date());
    return new RefreshAuthResponseDto(UserDto.from(user), accessToken);
  }
}
