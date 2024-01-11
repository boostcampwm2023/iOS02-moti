import { UserGroupGrade } from './user-group-grade';
import { UserGroup } from './user-group.doamin';
import { User } from '../../../users/domain/user.domain';

export class Group {
  id: number;
  name: string;
  avatarUrl: string;
  groupCode: string;
  categoryCount: number;
  categorySequence: number;
  userGroups: UserGroup[];

  constructor(
    name: string,
    avatarUrl: string,
    categoryCount: number,
    categorySequence: number,
  ) {
    this.name = name;
    this.avatarUrl = avatarUrl;
    this.userGroups = [];
    this.categoryCount = categoryCount;
    this.categorySequence = categorySequence;
  }

  addMember(user: User, userGrade: UserGroupGrade) {
    user.groupCount++;
    this.userGroups.push(
      new UserGroup(user, this, userGrade, ++user.groupSequence),
    );
  }

  assignAvatarUrl(url: string) {
    this.avatarUrl = url;
  }

  assignGroupCode(groupCode: string) {
    this.groupCode = groupCode;
  }

  deleteCategory() {
    this.categoryCount--;
  }
}
