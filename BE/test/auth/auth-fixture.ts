import { Injectable } from '@nestjs/common';
import { UsersFixture } from '../user/users-fixture';
import { JwtUtils } from '../../src/auth/application/jwt-utils';
import { AdminFixtureData, UserFixtureData } from './index';
import { JwtRolePayloads } from '../../src/auth';
import { AdminFixture } from '../admin/admin-fixture';

@Injectable()
export class AuthFixture {
  constructor(
    private readonly userFixture: UsersFixture,
    private readonly jwtUtils: JwtUtils,
    private readonly adminFixture: AdminFixture,
  ) {}

  async getAuthenticatedAdmin(id: number | string): Promise<AdminFixtureData> {
    const admin = await this.adminFixture.getAdmin(id);
    const claim: JwtRolePayloads = {
      userCode: admin.user.userCode,
      roles: admin.user.roles,
    };

    const accessToken = this.jwtUtils.createToken(claim, new Date());
    return {
      user: admin.user,
      admin,
      accessToken,
    };
  }

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

  async getExpiredAccessTokenUser(
    id: number | string,
  ): Promise<UserFixtureData> {
    const user = await this.userFixture.getUser(id);
    const claim: JwtRolePayloads = {
      userCode: user.userCode,
      roles: user.roles,
    };

    const accessToken = this.jwtUtils.createToken(
      claim,
      new Date('1970-01-01'),
    );
    return {
      user,
      accessToken,
    };
  }
}
