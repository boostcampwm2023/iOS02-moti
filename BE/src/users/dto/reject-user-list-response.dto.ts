import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from './user.dto';
import { UserBlockedUser } from '../domain/user-blocked-user.domain';
import { RejectedUser } from './reject-info.dto';

export class RejectUserListResponse {
  @ApiProperty({ description: '차단 유저 리스트', type: [UserDto] })
  data: RejectedUser[];

  constructor(userBlockedUsers: UserBlockedUser[]) {
    this.data = userBlockedUsers.map((ub) => RejectedUser.from(ub));
  }
}
