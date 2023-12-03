import { ApiProperty } from '@nestjs/swagger';
import { UserBlockedUser } from '../domain/user-blocked-user.domain';

export class RejectUserResponse {
  @ApiProperty({ description: '유저 아이디' })
  userId: number;
  @ApiProperty({ description: '차단 유저 아이디' })
  blockedUserId: number;

  constructor(userId: number, blockedUserId: number) {
    this.userId = userId;
    this.blockedUserId = blockedUserId;
  }

  static from(userBlockedUser: UserBlockedUser) {
    return new RejectUserResponse(
      userBlockedUser.user.id,
      userBlockedUser.blockedUser.id,
    );
  }
}
