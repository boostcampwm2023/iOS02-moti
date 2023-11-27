import { User } from '../../src/users/domain/user.domain';

export interface UserFixtureData {
  user: User;
  accessToken: string;
}
