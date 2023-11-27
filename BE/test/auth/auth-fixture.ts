import { Injectable } from '@nestjs/common';
import { UsersFixture } from '../user/users-fixture';
import { JwtUtils } from '../../src/auth/application/jwt-utils';
import { UserFixtureData } from './index';
import { JwtRolePayloads } from '../../src/auth';

@Injectable()
export class AuthFixture {
  constructor(
    private readonly userFixture: UsersFixture,
    private readonly jwtUtils: JwtUtils,
  ) {}

  async getAuthenticatedUser(id: number | string): Promise<UserFixtureData> {
    const user = await this.userFixture.getUser(id);
    const claim: JwtRolePayloads = {
      userCode: user.userCode,
      roles: user.roles,
    };

    const accessToken = this.jwtUtils.createToken(claim, new Date());
    return {
      user,
      accessToken,
    };
  }
}
