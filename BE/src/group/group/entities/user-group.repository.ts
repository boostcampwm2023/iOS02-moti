import { TransactionalRepository } from '../../../config/transaction-manager/transactional-repository';
import { CustomRepository } from '../../../config/typeorm/custom-repository.decorator';
import { UserGroupEntity } from './user-group.entity';
import { UserGroup } from '../domain/user-group.doamin';
import { Not } from 'typeorm';

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
      .select([
        'user_group.id',
        'user_group.grade',
        'user.id',
        'user.userCode',
        'group.id',
      ])
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
      .select([
        'user_group.id',
        'user_group.grade',
        'user.id',
        'user.userCode',
        'group.id',
      ])
      .where('user.userCode = :userCode', { userCode })
      .andWhere('group.id = :groupId', { groupId })
      .getOne();
    return userGroupEntity?.toModel();
  }

  async findAllByIdAndUser(
    userId: number,
    ids: number[],
  ): Promise<UserGroup[]> {
    const userGroups = await this.repository
      .createQueryBuilder('ug')
      .where('ug.user_id = :userId')
      .andWhere('ug.group_id in (:...ids)')
      .setParameter('ids', ids)
      .setParameter('userId', userId)
      .orderBy(`FIELD(ug.group_id, :...ids)`)
      .setParameter('ids', ids)
      .getMany();

    return userGroups.map((g) => g.toModel());
  }

  async findAllByGroupIdAndUserIdNotOrderByCreatedAtAsc(
    groupId: number,
    userId: number,
  ) {
    const userGroupEntities = await this.repository
      .createQueryBuilder('ug')
      .leftJoin('ug.user', 'user')
      .addSelect('user.id')
      .where('ug.group_id = :groupId', { groupId })
      .andWhere('ug.user_id != :userId', { userId })
      .orderBy('ug.createdAt', 'ASC')
      .getMany();

    return userGroupEntities.map((ug) => ug.toModel());
  }
  async findCountByGroupIdAndUserIdNot(groupId: number, userId: number) {
    return await this.repository
      .createQueryBuilder('ug')
      .where('ug.group_id = :groupId', { groupId })
      .andWhere('ug.user_id != :userId', { userId })
      .getCount();
  }

  async findAllByUserId(userId: number): Promise<UserGroup[]> {
    const userGroups = await this.repository
      .createQueryBuilder('ug')
      .leftJoin('ug.user', 'user')
      .leftJoin('ug.group', 'group')
      .addSelect(['user.id', 'group.id'])
      .where('ug.user_id = :userId', { userId })
      .andWhere('ug.group_id IS NOT NULL')
      .orderBy('ug.createdAt', 'ASC')
      .getMany();
    return userGroups.map((ug) => ug.toModel());
  }
}
