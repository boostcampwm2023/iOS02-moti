import { IsNotEmptyString } from '../../config/config/validation-decorator';
import { IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AdminLogin {
  @IsEmail(
    { domain_specific_validation: true, allow_display_name: false },
    { message: '이메일을 확인해주세요' },
  )
  @ApiProperty({ description: 'email' })
  email: string;

  @IsNotEmptyString({ message: '비밀번호를 확인해주세요' })
  @ApiProperty({ description: 'password' })
  password: string;

  constructor(email: string, password: string) {
    this.email = email;
    this.password = password;
  }
}
