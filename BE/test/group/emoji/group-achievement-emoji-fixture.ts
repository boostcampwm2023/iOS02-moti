import { GroupAchievement } from '../../../src/group/achievement/domain/group-achievement.domain';
import { User } from '../../../src/users/domain/user.domain';
import { Emoji } from '../../../src/group/emoji/domain/emoji';
import { GroupAchievementEmoji } from '../../../src/group/emoji/domain/group-achievement-emoji.domain';
import { Injectable } from '@nestjs/common';
import { GroupAchievementEmojiRepository } from '../../../src/group/emoji/entities/group-achievement-emoji.repository';

@Injectable()
export class GroupAchievementEmojiFixture {
  constructor(
    private readonly groupAchievementEmojiRepository: GroupAchievementEmojiRepository,
  ) {}

  async createGroupAchievementEmoji(
    user: User,
    groupAchievement: GroupAchievement,
    emoji: Emoji,
  ) {
    const groupAchievementEmoji =
      GroupAchievementEmojiFixture.groupAchievementEmoji(
        user,
        groupAchievement,
        emoji,
      );
    return await this.groupAchievementEmojiRepository.saveGroupAchievementEmoji(
      groupAchievementEmoji,
    );
  }

  static groupAchievementEmoji(
    user: User,
    groupAchievement: GroupAchievement,
    emoji: Emoji,
  ) {
    const groupAchievementEmoji = new GroupAchievementEmoji(
      groupAchievement,
      user,
      emoji,
    );
    return groupAchievementEmoji;
  }
}
