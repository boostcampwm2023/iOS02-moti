import { Module } from '@nestjs/common';
import { GroupFixture } from './group-fixture';
import { CustomTypeOrmModule } from '../../../src/config/typeorm/custom-typeorm.module';
import { GroupRepository } from '../../../src/group/group/entities/group.repository';
import { GroupModule } from '../../../src/group/group/group.module';
import { UserRepository } from '../../../src/users/entities/user.repository';
import { UsersModule } from '../../../src/users/users.module';

@Module({
  imports: [
    CustomTypeOrmModule.forCustomRepository([GroupRepository, UserRepository]),
    GroupModule,
    UsersModule,
  ],
  exports: [GroupFixture],
  providers: [GroupFixture],
})
export class GroupTestModule {}
