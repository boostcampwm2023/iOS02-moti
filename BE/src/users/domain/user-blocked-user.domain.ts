import { User } from './user.domain';

export class UserBlockedUser {
  user: User;
  blockedUser: User;
  createdAt: Date;

  constructor(user: User, blockedUser: User, createdAt?: Date) {
    this.user = user;
    this.blockedUser = blockedUser;
    this.createdAt = createdAt;
  }
}
