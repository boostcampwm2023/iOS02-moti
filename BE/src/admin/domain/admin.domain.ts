import { User } from '../../users/domain/user.domain';
import { AdminStatus } from './admin-status';
import { PasswordEncoder } from '../application/password-encoder';

export class Admin {
  user: User;
  email: string;
  password: string;
  status: AdminStatus = AdminStatus.PENDING;

  async register(passwordEncoder: PasswordEncoder) {
    this.password = await passwordEncoder.encode(this.password);
  }

  async auth(
    password: string,
    passwordEncoder: PasswordEncoder,
  ): Promise<boolean> {
    return passwordEncoder.compare(password, this.password);
  }

  constructor(user: User, email: string, password: string) {
    this.user = user;
    this.email = email;
    this.password = password;
  }
}
