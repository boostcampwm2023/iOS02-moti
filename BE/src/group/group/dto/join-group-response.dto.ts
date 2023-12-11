import { ApiProperty } from '@nestjs/swagger';

export class JoinGroupResponse {
  @ApiProperty({ description: '그룹 코드' })
  groupCode: string;
  @ApiProperty({ description: '초대된 유저의 유저 코드' })
  userCode: string;

  constructor(groupCode: string, userCode: string) {
    this.groupCode = groupCode;
    this.userCode = userCode;
  }
}
