import { CustomTypeOrmModule } from '../../config/typeorm/custom-typeorm.module';
import { GroupAchievementRepository } from './entities/group-achievement.repository';
import { GroupAchievementService } from './application/group-achievement.service';
import { GroupAchievementController } from './controller/group-achievement.controller';
import { Module } from '@nestjs/common';
import { UserBlockedGroupAchievementRepository } from './entities/user-blocked-group-achievement.repository';
import { GroupCategoryRepository } from '../category/entities/group-category.repository';
import { GroupRepository } from '../group/entities/group.repository';
import { ImageRepository } from '../../image/entities/image.repository';
import { UserGroupRepository } from '../group/entities/user-group.repository';

@Module({
  imports: [
    CustomTypeOrmModule.forCustomRepository([
      GroupAchievementRepository,
      GroupCategoryRepository,
      GroupRepository,
      ImageRepository,
      UserBlockedGroupAchievementRepository,
      UserGroupRepository,
    ]),
  ],
  controllers: [GroupAchievementController],
  providers: [GroupAchievementService],
})
export class GroupAchievementModule {}
