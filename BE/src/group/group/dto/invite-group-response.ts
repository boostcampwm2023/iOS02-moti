import { ApiProperty } from '@nestjs/swagger';

export class InviteGroupResponse {
  @ApiProperty({ description: '그룹 아이디' })
  groupId: number;
  @ApiProperty({ description: '초대된 유저의 유저 코드' })
  userCode: string;

  constructor(groupId: number, userCode: string) {
    this.groupId = groupId;
    this.userCode = userCode;
  }
}
