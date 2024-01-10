import { CustomTypeOrmModule } from '../../../src/config/typeorm/custom-typeorm.module';
import { Module } from '@nestjs/common';
import { GroupCategoryRepository } from '../../../src/group/category/entities/group-category.repository';
import { GroupCategoryFixture } from './group-category-fixture';
import { GroupRepository } from '../../../src/group/group/entities/group.repository';

@Module({
  imports: [
    CustomTypeOrmModule.forCustomRepository([
      GroupCategoryRepository,
      GroupRepository,
    ]),
  ],
  providers: [GroupCategoryFixture],
  exports: [GroupCategoryFixture],
})
export class GroupCategoryTestModule {}
