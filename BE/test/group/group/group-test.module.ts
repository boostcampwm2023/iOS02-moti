import { Module } from '@nestjs/common';
import { GroupFixture } from './group-fixture';
import { CustomTypeOrmModule } from '../../../src/config/typeorm/custom-typeorm.module';
import { GroupRepository } from '../../../src/group/group/entities/group.repository';
import { GroupModule } from '../../../src/group/group/group.module';

@Module({
  imports: [
    CustomTypeOrmModule.forCustomRepository([GroupRepository]),
    GroupModule,
  ],
  exports: [GroupFixture],
  providers: [GroupFixture],
})
export class GroupTestModule {}
