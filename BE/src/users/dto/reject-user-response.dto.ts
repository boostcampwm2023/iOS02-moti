import { ApiProperty } from '@nestjs/swagger';
import { UserBlockedUser } from '../domain/user-blocked-user.domain';

export class RejectUserResponse {
  @ApiProperty({ description: '유저 코드' })
  userCode: string;
  @ApiProperty({ description: '차단 유저 코드' })
  blockedUserCode: string;

  constructor(userCode: string, blockedUserCode: string) {
    this.userCode = userCode;
    this.blockedUserCode = blockedUserCode;
  }

  static from(userBlockedUser: UserBlockedUser) {
    return new RejectUserResponse(
      userBlockedUser.user.userCode,
      userBlockedUser.blockedUser.userCode,
    );
  }
}
