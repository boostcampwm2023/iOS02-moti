import { ApiProperty } from '@nestjs/swagger';

export class RevokeAppleAuthResponse {
  @ApiProperty({ description: 'userCode' })
  userCode: string;
  constructor(userCode: string) {
    this.userCode = userCode;
  }
}
