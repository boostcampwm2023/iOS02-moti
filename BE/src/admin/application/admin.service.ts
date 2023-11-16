import { Injectable } from '@nestjs/common';
import { AdminLogin } from '../dto/admin-login';
import { User } from '../../users/domain/user.domain';
import { AdminRepository } from '../entities/admin.repository';
import { Admin } from '../domain/admin.domain';
import { Transactional } from '../../config/transaction-manager';
import { UserAlreadyRegisteredAdmin } from '../exception/user-already-registered-admin';
import { PasswordEncoder } from './password-encoder';
import { AdminRegister } from '../dto/admin-register';
import { AdminInvalidPasswordException } from '../exception/admin-invalid-password';
import { JwtUtils } from '../../auth/application/jwt-utils';
import { JwtClaim } from '../../auth';

@Injectable()
export class AdminService {
  constructor(
    private readonly adminRepository: AdminRepository,
    private readonly passwordEncoder: PasswordEncoder,
    private readonly jwtUtils: JwtUtils,
  ) {}

  @Transactional({ readonly: true })
  async loginAdmin(loginRequest: AdminLogin) {
    const admin = await this.adminRepository.findActiveAdminByEmail(
      loginRequest.email,
    );
    if (!(await admin.auth(loginRequest.password, this.passwordEncoder)))
      throw new AdminInvalidPasswordException();
    const claim: JwtClaim = { userCode: admin.user.userCode };
    return this.jwtUtils.createToken(claim, new Date());
  }

  @Transactional()
  async registerAdmin(
    adminRegister: AdminRegister,
    user: User,
  ): Promise<Admin> {
    const admin = await this.adminRepository.getUserAdmin(user);
    if (admin) throw new UserAlreadyRegisteredAdmin();

    const registerAdmin = adminRegister.toModel(user);
    await registerAdmin.register(this.passwordEncoder);
    return this.adminRepository.saveAdmin(registerAdmin);
  }
}
