import { IsNotEmptyString } from '../../../config/config/validation-decorator';
import { ApiProperty } from '@nestjs/swagger';

export class InviteGroupRequest {
  @IsNotEmptyString({ message: '잘못된 유저 코드입니다.' })
  @ApiProperty({ description: '초대할 유저의 유저 초대' })
  userCode: string;

  constructor(userCode: string) {
    this.userCode = userCode;
  }
}
