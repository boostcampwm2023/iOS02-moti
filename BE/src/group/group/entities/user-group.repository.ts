import { TransactionalRepository } from '../../../config/transaction-manager/transactional-repository';
import { CustomRepository } from '../../../config/typeorm/custom-repository.decorator';
import { UserGroupEntity } from './user-group.entity';

@CustomRepository(UserGroupEntity)
export class UserGroupRepository extends TransactionalRepository<UserGroupEntity> {
  async findOneByUserIdAndGroupId(userId: number, groupId: number) {
    const userGroupEntity = await this.repository
      .createQueryBuilder('user_group')
      .leftJoin('user_group.user', 'user')
      .leftJoin('user_group.group', 'group')
      .select(['user_group.grade', 'user.id', 'group.id'])
      .where('user.id = :userId', { userId })
      .andWhere('group.id = :groupId', { groupId })
      .getOne();
    return userGroupEntity?.toModel();
  }
}
