import { IsNotEmptyString } from '../../config/config/validation-decorator';
import { ApiProperty } from '@nestjs/swagger';

export class RefreshAuthRequestDto {
  @IsNotEmptyString({ message: '잘못된 요청입니다.' })
  @ApiProperty({ description: 'refreshToken' })
  refreshToken: string;
  constructor(refreshToken: string) {
    this.refreshToken = refreshToken;
  }
}
