import { GroupCategory } from '../../category/domain/group.category';
import { Group } from '../../group/domain/group.domain';
import { User } from '../../../users/domain/user.domain';

export class GroupAchievement {
  id: number;
  title: string;
  user: User;
  group: Group;
  groupCategory: GroupCategory;
  content: string;
  createdAt: Date;
  constructor(
    title: string,
    user: User,
    group: Group,
    groupCategory: GroupCategory,
    content: string,
  ) {
    this.title = title;
    this.user = user;
    this.group = group;
    this.groupCategory = groupCategory;
    this.content = content;
  }
}
