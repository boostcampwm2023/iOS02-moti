import { Module } from '@nestjs/common';
import { CustomTypeOrmModule } from '../../../src/config/typeorm/custom-typeorm.module';
import { GroupAchievementEmojiRepository } from '../../../src/group/emoji/entities/group-achievement-emoji.repository';
import { GroupAchievementEmojiFixture } from './group-achievement-emoji-fixture';
import { GroupAchievementEmojiModule } from '../../../src/group/emoji/group-achievement-emoji.module';

@Module({
  imports: [
    CustomTypeOrmModule.forCustomRepository([GroupAchievementEmojiRepository]),
    GroupAchievementEmojiModule,
  ],
  providers: [GroupAchievementEmojiFixture],
  exports: [GroupAchievementEmojiFixture],
})
export class GroupAchievementEmojiTestModule {}
