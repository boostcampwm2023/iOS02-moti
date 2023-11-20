import { User } from '../../src/users/domain/user.domain';
import { Injectable } from '@nestjs/common';
import { UsersFixture } from '../user/users-fixture';
import { AdminRepository } from '../../src/admin/entities/admin.repository';
import { Admin } from '../../src/admin/domain/admin.domain';
import { UserRole } from '../../src/users/domain/user-role';
import { UserRepository } from '../../src/users/entities/user.repository';
import { AdminStatus } from '../../src/admin/domain/admin-status';

@Injectable()
export class AdminFixture {
  static id = 0;

  constructor(
    private readonly userRepository: UserRepository,
    private readonly adminRepository: AdminRepository,
  ) {}

  async getAdmin(
    id: number | string,
    email?: string,
    password?: string,
  ): Promise<Admin> {
    const user = UsersFixture.user(id);
    user.roles.push(UserRole.ADMIN);
    const adminRoleUser = await this.userRepository.saveUser(user);

    const admin = AdminFixture.admin(adminRoleUser, email, password);
    admin.status = AdminStatus.ACTIVE;

    return this.adminRepository.saveAdmin(admin);
  }

  static admin(user: User, email: string, password: string): Admin {
    return new Admin(
      user,
      email || `email${++AdminFixture.id}`,
      password || `password${AdminFixture.id}`,
    );
  }
}
