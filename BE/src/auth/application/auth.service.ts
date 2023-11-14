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
}
