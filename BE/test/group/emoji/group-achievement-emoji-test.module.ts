import { Module } from '@nestjs/common';
import { CustomTypeOrmModule } from '../../../src/config/typeorm/custom-typeorm.module';
import { GroupAchievementEmojiRepository } from '../../../src/group/emoji/entities/group-achievement-emoji.repository';
import { GroupAchievementEmojiFixture } from './group-achievement-emoji-fixture';
import { GroupAchievementEmojiModule } from '../../../src/group/emoji/group-achievement-emoji.module';
import { UsersTestModule } from '../../user/users-test.module';

@Module({
  imports: [
    CustomTypeOrmModule.forCustomRepository([GroupAchievementEmojiRepository]),
    GroupAchievementEmojiModule,
    UsersTestModule,
  ],
  providers: [GroupAchievementEmojiFixture],
  exports: [GroupAchievementEmojiFixture],
})
export class GroupAchievementEmojiTestModule {}
