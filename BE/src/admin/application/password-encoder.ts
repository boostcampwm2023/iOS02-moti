import { PlainTextPasswordEncoder } from './plain-text-password-encoder';
import { BcryptPasswordEncoder } from './bcrypt-password-encoder';

export interface IPasswordEncoder {
  encode(password: string): Promise<string>;
  compare(password: string, hash: string): Promise<boolean>;
}

export abstract class PasswordEncoder implements IPasswordEncoder {
  abstract encode(password: string): Promise<string>;
  abstract compare(password: string, hash: string): Promise<boolean>;
}

export const passwordEncoderProviderOptions = {
  provide: PasswordEncoder,
  useClass:
    process.env.NODE_ENV !== 'production'
      ? PlainTextPasswordEncoder
      : BcryptPasswordEncoder,
};
