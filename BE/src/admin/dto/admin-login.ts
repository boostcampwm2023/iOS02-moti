import { IsNotEmptyString } from '../../config/config/validation-decorator';
import { IsEmail } from 'class-validator';

export class AdminLogin {
  @IsEmail(
    { domain_specific_validation: true, allow_display_name: false },
    { message: '이메일을 확인해주세요' },
  )
  email: string;

  @IsNotEmptyString({ message: '비밀번호를 확인해주세요' })
  password: string;

  constructor(email: string, password: string) {
    this.email = email;
    this.password = password;
  }
}
