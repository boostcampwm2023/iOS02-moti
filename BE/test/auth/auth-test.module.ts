import { Module } from '@nestjs/common';
import { UsersTestModule } from '../user/users-test.module';
import { AuthModule } from '../../src/auth/auth.module';
import { AuthFixture } from './auth-fixture';

@Module({
  imports: [UsersTestModule, AuthModule],
  exports: [AuthFixture],
  providers: [AuthFixture],
})
export class AuthTestModule {}
