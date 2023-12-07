import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { UuidHolder } from './index';

@Injectable()
export class DefaultUuidHolder extends UuidHolder {
  uuid(): string {
    return uuidv4();
  }
}
