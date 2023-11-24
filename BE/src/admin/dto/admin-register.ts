import { IsEmail } from 'class-validator';
import {
  IsNotEmptyString,
  IsSameValueAs,
} from '../../config/config/validation-decorator';
import { User } from '../../users/domain/user.domain';
import { Admin } from '../domain/admin.domain';
import { ApiProperty } from '@nestjs/swagger';

export class AdminRegister {
  @IsEmail(
    { domain_specific_validation: true, allow_display_name: false },
    { message: '이메일을 확인해주세요' },
  )
  @ApiProperty({ description: 'email' })
  email: string;

  @IsNotEmptyString({ message: '비밀번호를 확인해주세요' })
  @ApiProperty({ description: 'password' })
  password: string;

  @IsSameValueAs('password', {
    message: '비밀번호와 일치하지 않습니다.',
  })
  @ApiProperty({ description: 'repeatedPassword' })
  repeatedPassword: string;

  constructor(email: string, password: string, repeatedPassword: string) {
    this.email = email;
    this.password = password;
    this.repeatedPassword = repeatedPassword;
  }

  toModel(user: User): Admin {
    return new Admin(user, this.email, this.password);
  }
}
