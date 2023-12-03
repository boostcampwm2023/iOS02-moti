import { Module } from '@nestjs/common';
import { CategoryController } from './controller/category.controller';
import { CategoryService } from './application/category.service';
import { CustomTypeOrmModule } from '../config/typeorm/custom-typeorm.module';
import { CategoryRepository } from './entities/category.repository';
import { CategoryLegacyController } from './controller/category-legacy.controller';
import { AchievementRepository } from '../achievement/entities/achievement.repository';

@Module({
  controllers: [CategoryController, CategoryLegacyController],
  imports: [
    CustomTypeOrmModule.forCustomRepository([
      CategoryRepository,
      AchievementRepository,
    ]),
  ],
  providers: [CategoryService],
})
export class CategoryModule {}
