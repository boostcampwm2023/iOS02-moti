import { IsNotEmptyString } from '../../config/config/validation-decorator';
import { MotiPolicy } from '../domain/moti-policy.domain';
import { ApiProperty } from '@nestjs/swagger';

export class MotiPolicyCreate {
  @IsNotEmptyString({ message: '잘못된 최신 버전입니다.' })
  @ApiProperty({ description: '최신 버전' })
  latest: string;

  @IsNotEmptyString({ message: '잘못된 최소 버전입니다.' })
  @ApiProperty({ description: '최소 버전' })
  required: string;

  @IsNotEmptyString({ message: '잘못된 보안 규약입니다.' })
  @ApiProperty({ description: '보안 규약' })
  privacyPolicy: string;

  constructor(latest: string, required: string, privacyPolicy: string) {
    this.latest = latest;
    this.required = required;
    this.privacyPolicy = privacyPolicy;
  }

  toModel(): MotiPolicy {
    return new MotiPolicy(this.latest, this.required, this.privacyPolicy);
  }
}
