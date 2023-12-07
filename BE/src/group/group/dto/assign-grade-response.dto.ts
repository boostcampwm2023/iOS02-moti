import { UserGroupGrade } from '../domain/user-group-grade';
import { UserGroup } from '../domain/user-group.doamin';

export class AssignGradeResponse {
  groupId: number;
  userCode: string;
  grade: UserGroupGrade;

  constructor(groupId: number, userCode: string, grade: UserGroupGrade) {
    this.groupId = groupId;
    this.userCode = userCode;
    this.grade = grade;
  }

  static from(userGroup: UserGroup) {
    return new AssignGradeResponse(
      userGroup.group.id,
      userGroup.user.userCode,
      userGroup.grade,
    );
  }
}
