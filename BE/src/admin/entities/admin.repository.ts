import { CustomRepository } from '../../config/typeorm/custom-repository.decorator';
import { AdminEntity } from './admin.entity';
import { TransactionalRepository } from '../../config/transaction-manager/transactional-repository';
import { Admin } from '../domain/admin.domain';
import { User } from '../../users/domain/user.domain';
import { UserEntity } from '../../users/entities/user.entity';
import { AdminStatus } from '../domain/admin-status';

@CustomRepository(AdminEntity)
export class AdminRepository extends TransactionalRepository<AdminEntity> {
  async saveAdmin(admin: Admin): Promise<Admin> {
    const adminEntity = AdminEntity.from(admin);
    const savedAdminEntity = await this.repository.save(adminEntity);
    return savedAdminEntity?.toModel();
  }

  async getUserAdmin(user: User): Promise<Admin> {
    const userEntity = UserEntity.from(user);
    const adminEntity: AdminEntity = await this.repository.findOne({
      where: { user: { id: userEntity.id } },
    });
    return adminEntity?.toModel();
  }

  async findActiveAdminByEmail(email: string): Promise<Admin> {
    const adminEntity = await this.repository.findOne({
      where: { email: email, status: AdminStatus.ACTIVE },
      relations: ['user'],
    });
    return adminEntity?.toModel();
  }
}
