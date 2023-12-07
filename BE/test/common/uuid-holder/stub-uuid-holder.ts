import { Injectable } from '@nestjs/common';
import { UuidHolder } from '../../../src/common/application/uuid-holder';

@Injectable()
export class StubUuidHolder extends UuidHolder {
  private stubUuid: string;

  setUuid(uuid: string) {
    this.stubUuid = uuid;
  }

  uuid(): string {
    return this.stubUuid || 'aaaa-bbbb-cccc-dddd-eeee-ffff';
  }
}
