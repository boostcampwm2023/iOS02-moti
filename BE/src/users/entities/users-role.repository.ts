import { CustomRepository } from '../../config/typeorm/custom-repository.decorator';
import { TransactionalRepository } from '../../config/transaction-manager/transactional-repository';
import { UsersRoleEntity } from './users-role.entity';
import { UserRole } from '../domain/user-role';
import { User } from '../domain/user.domain';
import { UserEntity } from './user.entity';

@CustomRepository(UsersRoleEntity)
export class UsersRoleRepository extends TransactionalRepository<UsersRoleEntity> {
  async saveUserRole(user: User, userRole: UserRole): Promise<UserRole> {
    const userEntity = UserEntity.from(user);
    const userRoleEntity = new UsersRoleEntity(userEntity, userRole);
    const saved = await this.repository.save(userRoleEntity);
    return saved.toModel();
  }

  async findUserRole(user: User): Promise<UserRole[]> {
    const userEntity = UserEntity.from(user);
    const usersRoleEntities = await this.repository.find({
      where: { user: { id: userEntity.id } },
    });
    return usersRoleEntities?.map((entity) => entity.toModel());
  }
}
