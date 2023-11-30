import { Module } from '@nestjs/common';
import { CustomTypeOrmModule } from '../../config/typeorm/custom-typeorm.module';
import { GroupCategoryRepository } from './entities/group-category.repository';

@Module({
  imports: [CustomTypeOrmModule.forCustomRepository([GroupCategoryRepository])],
})
export class GroupCategoryModule {}
