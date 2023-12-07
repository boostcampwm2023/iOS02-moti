import { ApiProperty } from '@nestjs/swagger';
import { GroupUserInfo } from '../../../users/dto/group-user-info.dto';

export class GroupUserListResponse {
  @ApiProperty({ description: '그룹 유저 리스트', type: [GroupUserInfo] })
  data: GroupUserInfo[];

  constructor(groupUsersInfo: GroupUserInfo[]) {
    this.data = groupUsersInfo;
  }
}
