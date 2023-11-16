export class User {
  id: number;

  avatarUrl: string;

  userCode: string;

  userIdentifier: string;

  static from(userIdentifier: string) {
    const user = new User();
    user.userIdentifier = userIdentifier;
    return user;
  }

  assignUserCode(userCode: string) {
    this.userCode = userCode;
  }
}
