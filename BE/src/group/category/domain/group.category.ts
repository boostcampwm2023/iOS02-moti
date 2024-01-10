import { User } from '../../../users/domain/user.domain';
import { Group } from '../../group/domain/group.domain';

export class GroupCategory {
  id: number;
  user: User;
  group: Group;
  name: string;
  seq: number;

  constructor(user: User, group: Group, name: string, seq: number) {
    this.user = user;
    this.group = group;
    this.name = name;
    this.seq = seq;
  }
}
