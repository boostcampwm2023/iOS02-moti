import { Group } from '../../../src/group/group/domain/group.domain';

export class GroupFixture {
  static id: number = 0;

  static group(name?: string) {
    return new Group(name || `group${++GroupFixture.id}`, 'file://avatarUrl');
  }
}
