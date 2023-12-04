import { GroupCategory } from '../../category/domain/group.category';
import { Group } from '../../group/domain/group.domain';
import { User } from '../../../users/domain/user.domain';
import { Image } from '../../../image/domain/image.domain';

export class GroupAchievement {
  id: number;
  title: string;
  user: User;
  group: Group;
  groupCategory: GroupCategory;
  content: string;
  createdAt: Date;
  image: Image;

  constructor(
    title: string,
    user: User,
    group: Group,
    groupCategory: GroupCategory,
    content: string,
    image: Image,
  ) {
    this.title = title;
    this.user = user;
    this.group = group;
    this.groupCategory = groupCategory;
    this.content = content;
    this.image = image;
  }
}
