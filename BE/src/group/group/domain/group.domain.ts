import { UserGroupGrade } from './user-group-grade';
import { UserGroup } from './user-group.doamin';
import { User } from '../../../users/domain/user.domain';

export class Group {
  id: number;
  name: string;
  avatarUrl: string;
  userGroups: UserGroup[];

  constructor(name: string, avatarUrl: string) {
    this.name = name;
    this.avatarUrl = avatarUrl;
    this.userGroups = [];
  }

  addMember(user: User, userGrade: UserGroupGrade) {
    this.userGroups.push(new UserGroup(user, this, userGrade));
  }

  assignAvatarUrl(url: string) {
    this.avatarUrl = url;
  }
}
