import { Module } from '@nestjs/common';
import { UsersTestModule } from '../user/users-test.module';
import { AuthModule } from '../../src/auth/auth.module';
import { AuthFixture } from './auth-fixture';
import { AdminTestModule } from '../admin/admin-test.module';
import { StubOauthHandler } from './StubOauthHandler';

@Module({
  imports: [UsersTestModule, AuthModule, AdminTestModule],
  exports: [AuthFixture],
  providers: [AuthFixture, StubOauthHandler],
})
export class AuthTestModule {}
