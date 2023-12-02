import { CustomTypeOrmModule } from '../../config/typeorm/custom-typeorm.module';
import { GroupAchievementRepository } from './entities/group-achievement.repository';
import { GroupAchievementService } from './application/group-achievement.service';
import { GroupAchievementController } from './controller/group-achievement.controller';
import { Module } from '@nestjs/common';
import { UserBlockedGroupAchievementRepository } from './entities/user-blocked-group-achievement.repository';

@Module({
  imports: [
    CustomTypeOrmModule.forCustomRepository([
      GroupAchievementRepository,
      UserBlockedGroupAchievementRepository,
    ]),
  ],
  controllers: [GroupAchievementController],
  providers: [GroupAchievementService],
})
export class GroupAchievementModule {}
