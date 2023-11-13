import { IsNotEmpty, IsString } from 'class-validator';
import { MotiPolicy } from '../domain/moti-policy.domain';
import { ApiProperty } from '@nestjs/swagger';

export class MotiPolicyCreate {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: '최신 버전' })
  latest: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: '최소 버전' })
  required: string;

  @IsNotEmpty()
  @IsString()
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
