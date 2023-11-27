import { Module } from '@nestjs/common';
import { AchievementController } from './controller/achievement.controller';
import { AchievementService } from './application/achievement.service';
import { CustomTypeOrmModule } from '../config/typeorm/custom-typeorm.module';
import { AchievementRepository } from './entities/achievement.repository';
import { CategoryRepository } from '../category/entities/category.repository';

@Module({
  imports: [
    CustomTypeOrmModule.forCustomRepository([
      AchievementRepository,
      CategoryRepository,
    ]),
  ],
  controllers: [AchievementController],
  providers: [AchievementService],
})
export class AchievementModule {}
