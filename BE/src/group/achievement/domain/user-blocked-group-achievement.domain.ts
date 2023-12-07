import { User } from '../../../users/domain/user.domain';
import { GroupAchievement } from './group-achievement.domain';

export class UserBlockedGroupAchievement {
  id: number;
  user: User;
  groupAchievement: GroupAchievement;

  constructor(user: User, groupAchievement: GroupAchievement) {
    this.user = user;
    this.groupAchievement = groupAchievement;
  }
}
