import { ApiProperty } from '@nestjs/swagger';

export class GroupLeaveResponse {
  @ApiProperty({ description: '유저 아이디' })
  userId: number;
  @ApiProperty({ description: '그룹 아이디' })
  groupId: number;

  constructor(userId: number, groupId: number) {
    this.userId = userId;
    this.groupId = groupId;
  }
}
