import { IsNotEmptyString } from '../../config/config/validation-decorator';
import { ApiProperty } from '@nestjs/swagger';
import { MotiPolicy } from '../domain/moti-policy.domain';

export class MotiPolicyIdempotentUpdate {
  @IsNotEmptyString({ message: '올바른 형태로 최신 규약을 입력해주세요.' })
  @ApiProperty({ description: '최신 버전' })
  latest: string;

  @IsNotEmptyString({ message: '올바른 형태로 최소 버전을 입력해주세요.' })
  @ApiProperty({ description: '최소 버전' })
  required: string;

  @IsNotEmptyString({ message: '올바른 형태로 보안 규약을 입력해주세요' })
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
