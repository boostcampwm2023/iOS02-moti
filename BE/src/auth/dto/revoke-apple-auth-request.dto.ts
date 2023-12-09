import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmptyString } from '../../config/config/validation-decorator';

export class RevokeAppleAuthRequest {
  @IsNotEmptyString()
  @ApiProperty({ description: 'identityToken' })
  identityToken: string;
  @IsNotEmptyString()
  @ApiProperty({ description: 'authorizationCode' })
  authorizationCode: string;

  constructor(identityToken: string, authorizationCode: string) {
    this.identityToken = identityToken;
    this.authorizationCode = authorizationCode;
  }
}
