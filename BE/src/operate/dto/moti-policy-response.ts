import { MotiPolicy } from '../domain/moti-policy.domain';
import { ApiProperty } from '@nestjs/swagger';

export class MotiPolicyResponse {
  @ApiProperty({ description: '최신 버전' })
  latest: string;
  @ApiProperty({ description: '최소 버전' })
  required: string;
  @ApiProperty({ description: '보안 규약' })
  privacyPolicy: string;

  constructor(latest: string, required: string, privacyPolicy: string) {
    this.latest = latest;
    this.required = required;
    this.privacyPolicy = privacyPolicy;
  }

  static from(motiVersion: MotiPolicy) {
    return new MotiPolicyResponse(
      motiVersion.latest,
      motiVersion.required,
      motiVersion.privacyPolicy,
    );
  }
}
