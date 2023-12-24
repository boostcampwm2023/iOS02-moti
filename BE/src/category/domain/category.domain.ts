import { User } from '../../users/domain/user.domain';

export class Category {
  id: number;
  user: User;
  name: string;
  seq: number;

  constructor(user: User, name: string, seq: number) {
    this.user = user;
    this.name = name;
    this.seq = seq;
  }
}
