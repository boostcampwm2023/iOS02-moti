import { User } from '../../../users/domain/user.domain';
import { Group } from './group.domain';
import { UserGroupGrade } from './user-group-grade';

export class UserGroup {
  id: number;
  user: User;
  group: Group;
  grade: UserGroupGrade;

  constructor(user: User, group: Group, grade: UserGroupGrade) {
    this.user = user;
    this.group = group;
    this.grade = grade;
  }
  changeGrade(grade: UserGroupGrade) {
    this.grade = grade;
  }
}
