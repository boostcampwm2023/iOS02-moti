import { Injectable } from '@nestjs/common';
import { AdminLogin } from '../dto/admin-login';
import { User } from '../../users/domain/user.domain';
import { AdminRepository } from '../entities/admin.repository';
import { Admin } from '../domain/admin.domain';
import { Transactional } from '../../config/transaction-manager';
import { UserAlreadyRegisteredAdminException } from '../exception/user-already-registered-admin.exception';
import { PasswordEncoder } from './password-encoder';
import { AdminRegister } from '../dto/admin-register';
import { AdminInvalidPasswordException } from '../exception/admin-invalid-password.exception';
import { JwtUtils } from '../../auth/application/jwt-utils';
import { JwtRolePayloads } from '../../auth';
import { UserNotAdminPendingStatusException } from '../exception/user-not-admin-pending-status.exception';
import { UsersRoleRepository } from '../../users/entities/users-role.repository';
import { UserRole } from '../../users/domain/user-role';

@Injectable()
export class AdminService {
  constructor(
    private readonly adminRepository: AdminRepository,
    private readonly passwordEncoder: PasswordEncoder,
    private readonly userRoleRepository: UsersRoleRepository,
    private readonly jwtUtils: JwtUtils,
  ) {}

  @Transactional({ readonly: true })
  async loginAdmin(loginRequest: AdminLogin) {
    const admin = await this.adminRepository.findActiveAdminByEmail(
      loginRequest.email,
    );
    if (!admin) throw new UserNotAdminPendingStatusException();
    if (!(await admin.auth(loginRequest.password, this.passwordEncoder)))
      throw new AdminInvalidPasswordException();
    const claim: JwtRolePayloads = {
      userCode: admin.user.userCode,
      roles: admin.user.roles,
    };
    return this.jwtUtils.createToken(claim, new Date());
  }

  @Transactional()
  async registerAdmin(
    adminRegister: AdminRegister,
    user: User,
  ): Promise<Admin> {
    const admin = await this.adminRepository.getUserAdmin(user);
    if (admin) throw new UserAlreadyRegisteredAdminException();

    const registerAdmin = adminRegister.toModel(user);
    await registerAdmin.register(this.passwordEncoder);
    return this.adminRepository.saveAdmin(registerAdmin);
  }
}
