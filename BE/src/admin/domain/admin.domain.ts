import { User } from '../../users/domain/user.domain';
import { AdminStatus } from './admin-status';
import { PasswordEncoder } from '../application/password-encoder';
import { UserRole } from '../../users/domain/user-role';

export class Admin {
  readonly user: User;
  email: string;
  password: string;
  status: AdminStatus = AdminStatus.PENDING;

  accepted() {
    this.status = AdminStatus.ACTIVE;
    this.user.roles = [...this.user.roles, UserRole.ADMIN];
  }

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
