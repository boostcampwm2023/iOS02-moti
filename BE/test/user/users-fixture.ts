import { User } from '../../src/users/domain/user.domain';
import { UserRepository } from '../../src/users/entities/user.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersFixture {
  static id = 0;

  constructor(private readonly userRepository: UserRepository) {}

  async getUser(id: number | string): Promise<User> {
    const user = UsersFixture.user(id);
    return this.userRepository.saveUser(user);
  }

  async getUsers(count: number, id?: number | string) {
    const users: User[] = [];
    for (let i = 0; i < count; i++) {
      users.push(
        await this.getUser(`${id}${++UsersFixture.id}` || ++UsersFixture.id),
      );
    }
    return users;
  }

  static user(id: number | string): User {
    const user = new User();
    user.assignUserCode(`ABCD${id || ++UsersFixture.id}`);
    user.userIdentifier = `eifnla.alsekjf.${id}`;
    return user;
  }
}
