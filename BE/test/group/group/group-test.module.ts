import { GroupFixture } from './group-fixture';
import { GroupRepository } from '../../../src/group/group/entities/group.repository';
import { CustomTypeOrmModule } from '../../../src/config/typeorm/custom-typeorm.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [CustomTypeOrmModule.forCustomRepository([GroupRepository])],
  providers: [GroupFixture],
  exports: [GroupFixture],
})
export class GroupTestModule {}
