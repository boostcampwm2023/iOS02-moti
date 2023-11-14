import { ApiProperty } from '@nestjs/swagger';
import { MotiPolicy } from '../domain/moti-policy.domain';
import { MotiPolicyUpdate } from './index';
import { IsNullOrString } from '../../config/config/validation-decorator';

export class MotiPolicyPartialUpdate implements MotiPolicyUpdate {
  @IsNullOrString({ message: '잘못된 최신 버전입니다.' })
  @ApiProperty({ description: '최신 버전' })
  latest: string;

  @IsNullOrString({ message: '잘못된 최소 버전입니다.' })
  @ApiProperty({ description: '최소 버전' })
  required: string;

  @IsNullOrString({ message: '잘못된 보안 규약입니다.' })
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
