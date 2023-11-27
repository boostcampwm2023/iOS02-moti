import { Admin } from 'src/admin/domain/admin.domain';
import { User } from '../../src/users/domain/user.domain';

export interface UserFixtureData {
  user: User;
  accessToken: string;
}

export interface AdminFixtureData extends UserFixtureData {
  admin: Admin;
}
