import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { IPasswordEncoder } from './password-encoder';

@Injectable()
export class BcryptPasswordEncoder implements IPasswordEncoder {
  private readonly salt: number;

  constructor(configService: ConfigService) {
    this.salt = configService.get<number>('BCRYPT_SALT');
  }

  compare(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  encode(password: string): Promise<string> {
    return bcrypt.hash(password, this.salt);
  }
}
