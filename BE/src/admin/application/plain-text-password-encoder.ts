import { Injectable } from '@nestjs/common';
import { IPasswordEncoder } from './password-encoder';

@Injectable()
export class PlainTextPasswordEncoder implements IPasswordEncoder {
  compare(password: string, hash: string): Promise<boolean> {
    return Promise.resolve(password === hash);
  }

  encode(password: string): Promise<string> {
    return Promise.resolve(password);
  }
}
