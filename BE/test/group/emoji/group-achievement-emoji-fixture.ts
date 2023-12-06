import { GroupAchievement } from '../../../src/group/achievement/domain/group-achievement.domain';
import { User } from '../../../src/users/domain/user.domain';
import { Emoji } from '../../../src/group/emoji/domain/emoji';
import { GroupAchievementEmoji } from '../../../src/group/emoji/domain/group-achievement-emoji.domain';

export class GroupAchievementEmojiFixture {
  static groupAchievementEmoji(
    user: User,
    groupAchievement: GroupAchievement,
    emoji: Emoji,
  ) {
    const groupAchievementEmoji = new GroupAchievementEmoji();
    groupAchievementEmoji.groupAchievement = groupAchievement;
    groupAchievementEmoji.user = user;
    groupAchievementEmoji.emoji = emoji;
    return groupAchievementEmoji;
  }
}
