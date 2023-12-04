import { TransactionalRepository } from '../../../config/transaction-manager/transactional-repository';
import { CustomRepository } from '../../../config/typeorm/custom-repository.decorator';
import { UserGroupEntity } from './user-group.entity';
import { UserGroup } from '../domain/user-group.doamin';

@CustomRepository(UserGroupEntity)
export class UserGroupRepository extends TransactionalRepository<UserGroupEntity> {
  async saveUserGroup(userGroup: UserGroup): Promise<UserGroup> {
    const newUserGroup = UserGroupEntity.from(userGroup);
    await this.repository.save(newUserGroup);
    return newUserGroup.toModel();
  }
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

  async findOneByUserCodeAndGroupId(userCode: string, groupId: number) {
    const userGroupEntity = await this.repository
      .createQueryBuilder('user_group')
      .leftJoin('user_group.user', 'user')
      .leftJoin('user_group.group', 'group')
      .select(['user_group.grade', 'user.id', 'group.id'])
      .where('user.userCode = :userCode', { userCode })
      .andWhere('group.id = :groupId', { groupId })
      .getOne();
    return userGroupEntity?.toModel();
  }
}
