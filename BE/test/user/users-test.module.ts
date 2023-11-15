import { CustomTypeOrmModule } from '../../src/config/typeorm/custom-typeorm.module';
import { UserRepository } from '../../src/users/entities/user.repository';
import { UsersFixture } from './users-fixture';
import { Module } from '@nestjs/common';
import { UsersModule } from '../../src/users/users.module';

@Module({
  imports: [
    CustomTypeOrmModule.forCustomRepository([UserRepository]),
    UsersModule,
  ],
  providers: [UsersFixture],
})
export class UsersTestModule {}
