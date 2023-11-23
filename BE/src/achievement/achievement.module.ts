import { Module } from '@nestjs/common';
import { AchievementController } from './controller/achievement.controller';
import { AchievementService } from './application/achievement.service';
import { CustomTypeOrmModule } from '../config/typeorm/custom-typeorm.module';
import { AchievementRepository } from './entities/achievement.repository';

@Module({
  imports: [CustomTypeOrmModule.forCustomRepository([AchievementRepository])],
  controllers: [AchievementController],
  providers: [AchievementService],
})
export class AchievementModule {}
