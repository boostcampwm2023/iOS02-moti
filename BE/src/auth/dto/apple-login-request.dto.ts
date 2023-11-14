import { IsNotEmptyString } from '../../config/config/validation-decorator';
import { ApiProperty } from '@nestjs/swagger';

export class AppleLoginRequest {
  @IsNotEmptyString({ message: '잘못된 로그인 요청입니다.' })
  @ApiProperty({ description: 'identityToken' })
  identityToken: string;
  constructor(identityToken: string) {
    this.identityToken = identityToken;
  }
}
