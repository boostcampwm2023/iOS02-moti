import { IAchievementDetail } from '../../achievement';
import { User } from '../../users/domain/user.domain';
import { GroupCategory } from '../category/domain/group.category';

export interface IGroupAchievementDetail extends IAchievementDetail {
  userCode: string;
}

export interface IGroupAchievementListDetail {
  id: number;
  title: string;
  thumbnailUrl: string;
  userCode: string;
  avatarUrl: string;
  categoryId: number;
}

export interface GroupAchievementUpdate {
  user?: User;
  category?: GroupCategory;
  title?: string;
  content?: string;
  imageUrl?: string;
  thumbnailUrl?: string;
}

export class UserInfo {
  userCode: string;
  avatarUrl: string;
  constructor(userCode: string, avatarUrl: string) {
    this.userCode = userCode;
    this.avatarUrl = avatarUrl;
  }
}
