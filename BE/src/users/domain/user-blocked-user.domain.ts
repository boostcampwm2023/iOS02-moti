import { User } from './user.domain';

export class UserBlockedUser {
  user: User;
  blockedUser: User;

  constructor(user: User, blockedUser: User) {
    this.user = user;
    this.blockedUser = blockedUser;
  }
}
