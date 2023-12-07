import { User } from '../../../users/domain/user.domain';
import { GroupAchievement } from '../../achievement/domain/group-achievement.domain';
export class GroupAchievementImage {
  id: number;
  user: User;
  originalName: string;
  imageUrl: string;
  thumbnailUrl: string;
  groupAchievement: GroupAchievement;

  constructor(user: User) {
    this.user = user;
  }
}
