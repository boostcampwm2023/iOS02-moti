import { User } from '../../../users/domain/user.domain';
import { Group } from './group.domain';
import { UserGroupGrade } from './user-group-grade';

export class UserGroup {
  user: User;
  group: Group;
  grade: UserGroupGrade;

  constructor(user: User, group: Group, grade: UserGroupGrade) {
    this.user = user;
    this.group = group;
    this.grade = grade;
  }
}
