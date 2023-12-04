import { IsNotUserGroupGrade } from '../../../config/config/validation-decorator';
import { ApiProperty } from '@nestjs/swagger';
import { UserGroupGrade } from '../domain/user-group-grade';

export class AssignGradeRequest {
  @IsNotUserGroupGrade({ message: '잘못된 권한 이름입니다.' })
  @ApiProperty({ description: '권한 이름' })
  grade: UserGroupGrade;

  constructor(grade: UserGroupGrade) {
    this.grade = grade;
  }
}
