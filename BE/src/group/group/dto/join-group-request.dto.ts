import { IsNotEmptyString } from '../../../config/config/validation-decorator';
import { ApiProperty } from '@nestjs/swagger';

export class JoinGroupRequest {
  @IsNotEmptyString({ message: '잘못된 유저 코드입니다.' })
  @ApiProperty({ description: '가입할 그룹의 그룹코드' })
  groupCode: string;

  constructor(groupCode: string) {
    this.groupCode = groupCode;
  }
}
