import { Injectable } from '@nestjs/common';
import { IPasswordEncoder, PasswordEncoder } from './password-encoder';
import { BcryptPasswordEncoder } from './bcrypt-password-encoder';

@Injectable()
export class PlainTextPasswordEncoder implements IPasswordEncoder {
  compare(password: string, hash: string): Promise<boolean> {
    return Promise.resolve(password === hash);
  }

  encode(password: string): Promise<string> {
    return Promise.resolve(password);
  }
}

export const passwordEncoderProviderOptions = {
  provide: PasswordEncoder,
  useClass:
    process.env.NODE_ENV !== 'production'
      ? PlainTextPasswordEncoder
      : BcryptPasswordEncoder,
};
