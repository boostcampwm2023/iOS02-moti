import { Module } from '@nestjs/common';
import { CustomTypeOrmModule } from '../../src/config/typeorm/custom-typeorm.module';
import { UserRepository } from '../../src/users/entities/user.repository';
import { AdminFixture } from './admin-fixture';
import { UsersTestModule } from '../user/users-test.module';
import { AdminModule } from '../../src/admin/admin.module';
import { AdminRepository } from '../../src/admin/entities/admin.repository';

@Module({
  imports: [
    CustomTypeOrmModule.forCustomRepository([AdminRepository, UserRepository]),
    UsersTestModule,
    AdminModule,
  ],
  providers: [AdminFixture],
  exports: [AdminFixture],
})
export class AdminTestModule {}
