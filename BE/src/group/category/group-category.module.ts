import { Module } from '@nestjs/common';
import { CustomTypeOrmModule } from '../../config/typeorm/custom-typeorm.module';
import { GroupCategoryRepository } from './entities/group-category.repository';
import { GroupCategoryService } from './application/group-category.service';
import { GroupRepository } from '../group/entities/group.repository';
import { GroupCategoryController } from './controller/group-category.controller';

@Module({
  imports: [
    CustomTypeOrmModule.forCustomRepository([
      GroupCategoryRepository,
      GroupRepository,
    ]),
  ],
  controllers: [GroupCategoryController],
  providers: [GroupCategoryService],
})
export class GroupCategoryModule {}
