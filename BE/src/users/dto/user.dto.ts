import { User } from '../domain/user.domain';
import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty({ description: 'avatarUrl' })
  avatarUrl: string;
  @ApiProperty({ description: 'userCode' })
  userCode: string;
  constructor(avatarUrl: string, userCode: string) {
    this.avatarUrl = avatarUrl;
    this.userCode = userCode;
  }
  static from(user: User) {
    return new UserDto(user.avatarUrl, user.userCode);
  }
}
