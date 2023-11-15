import { UserDto } from '../../users/dto/user.dto';
import { ApiProperty } from '@nestjs/swagger';

export class AppleLoginResponse {
  @ApiProperty({ description: 'user' })
  user: UserDto;
  @ApiProperty({ description: 'accessToken' })
  accessToken: string;
  @ApiProperty({ description: 'refreshToken' })
  refreshToken: string;

  constructor(user: UserDto, accessToken: string, refreshToken: string) {
    this.user = user;
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }
}
