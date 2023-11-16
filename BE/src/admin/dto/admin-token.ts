import { ApiProperty } from '@nestjs/swagger';

export class AdminToken {
  @ApiProperty({ description: '인증 토큰' })
  accessToken: string;

  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }

  static from(accessToken: string): AdminToken {
    return new AdminToken(accessToken);
  }
}
