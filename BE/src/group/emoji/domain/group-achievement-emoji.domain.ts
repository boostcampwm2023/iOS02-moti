import { GroupAchievement } from '../../achievement/domain/group-achievement.domain';
import { Emoji } from './emoji';
import { User } from '../../../users/domain/user.domain';

export class GroupAchievementEmoji {
  id: number;
  groupAchievement: GroupAchievement;
  user: User;
  emoji: Emoji;

  constructor(groupAchievement: GroupAchievement, user: User, emoji: Emoji) {
    this.groupAchievement = groupAchievement;
    this.user = user;
    this.emoji = emoji;
  }
}
