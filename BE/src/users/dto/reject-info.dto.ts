import { ApiProperty } from '@nestjs/swagger';
import { dateFormat } from '../../common/utils/date-formatter';
import { UserBlockedUser } from '../domain/user-blocked-user.domain';

export class RejectedUser {
  @ApiProperty({ description: 'avatarUrl' })
  avatarUrl: string;
  @ApiProperty({ description: 'userCode' })
  userCode: string;
  @ApiProperty({ description: '차단 일자' })
  createdAt: string;
  constructor(avatarUrl: string, userCode: string, createdAt: Date) {
    this.avatarUrl = avatarUrl;
    this.userCode = userCode;
    this.createdAt = dateFormat(createdAt);
  }

  static from(userBlockedUser: UserBlockedUser) {
    return new RejectedUser(
      userBlockedUser.blockedUser.avatarUrl,
      userBlockedUser.blockedUser.userCode,
      userBlockedUser.createdAt,
    );
  }
}
