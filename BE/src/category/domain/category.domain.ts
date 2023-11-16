import { User } from '../../users/domain/user.domain';

export class Category {
  id: number;
  user: User;
  name: string;

  constructor(user: User, name: string) {
    this.user = user;
    this.name = name;
  }
}
