import { Module } from '@nestjs/common';
import { CustomTypeOrmModule } from '../../config/typeorm/custom-typeorm.module';
import { GroupAchievementEmojiRepository } from './entities/group-achievement-emoji.repository';
import { GroupAchievementRepository } from '../achievement/entities/group-achievement.repository';
import { GroupAchievementEmojiService } from './application/group-achievement-emoji.service';
import { UserGroupRepository } from '../group/entities/user-group.repository';
import { GroupAchievementEmojiController } from './controller/group-achievement-emoji.controller';

@Module({
  imports: [
    CustomTypeOrmModule.forCustomRepository([
      GroupAchievementEmojiRepository,
      GroupAchievementRepository,
      UserGroupRepository,
    ]),
  ],
  controllers: [GroupAchievementEmojiController],
  providers: [GroupAchievementEmojiService],
})
export class GroupAchievementEmojiModule {}
