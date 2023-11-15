import { UserDto } from '../../users/dto/user.dto';
import { ApiProperty } from '@nestjs/swagger';

export class RefreshAuthResponseDto {
  @ApiProperty({ description: 'user' })
  user: UserDto;
  @ApiProperty({ description: 'accessToken' })
  accessToken: string;

  constructor(user: UserDto, accessToken: string) {
    this.user = user;
    this.accessToken = accessToken;
  }
}
