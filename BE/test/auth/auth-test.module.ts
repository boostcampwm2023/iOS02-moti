import { Module } from '@nestjs/common';
import { UsersTestModule } from '../user/users-test.module';
import { AuthModule } from '../../src/auth/auth.module';
import { AuthFixture } from './auth-fixture';
import { AdminTestModule } from '../admin/admin-test.module';

@Module({
  imports: [UsersTestModule, AuthModule, AdminTestModule],
  exports: [AuthFixture],
  providers: [AuthFixture],
})
export class AuthTestModule {}
