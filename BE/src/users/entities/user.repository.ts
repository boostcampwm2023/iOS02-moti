import { UserEntity } from './user.entity';
import { CustomRepository } from '../../config/typeorm/custom-repository.decorator';
import { User } from '../domain/user.domain';
import { TransactionalRepository } from '../../config/transaction-manager/transactional-repository';
import { IGroupUserInfo } from '../index';
import { GroupUserInfo } from '../dto/group-user-info.dto';

@CustomRepository(UserEntity)
export class UserRepository extends TransactionalRepository<UserEntity> {
  async findOneByUserIdentifier(userIdentifier: string): Promise<User> {
    const userEntity = await this.repository.findOne({
      where: { userIdentifier: userIdentifier },
    });
    return userEntity?.toModel();
  }

  async findOneByUserCode(userCode: string): Promise<User> {
    const userEntity = await this.repository.findOneBy({
      userCode: userCode,
    });
    return userEntity?.toModel();
  }

  async saveUser(user: User): Promise<User> {
    const userEntity = UserEntity.from(user);
    const saved = await this.repository.save(userEntity);
    return saved.toModel();
  }

  async updateUser(user: User): Promise<User> {
    user.clearRelations();
    const userEntity = UserEntity.from(user);
    const saved = await this.repository.save(userEntity);
    return saved.toModel();
  }

  async existByUserCode(userCode: string) {
    return await this.repository.exist({ where: { userCode: userCode } });
  }

  async findOneByUserIdentifierWithRoles(
    userIdentifier: string,
  ): Promise<User> {
    const userEntity = await this.repository.findOne({
      where: { userIdentifier: userIdentifier },
      relations: ['userRoles'],
    });
    return userEntity?.toModel();
  }

  async findOneByUserCodeWithRoles(userCode: string): Promise<User> {
    const userEntity = await this.repository.findOne({
      where: { userCode: userCode },
      relations: ['userRoles'],
    });
    return userEntity?.toModel();
  }

  async findByGroupId(groupId: number) {
    const groupUsersInfo = await this.repository
      .createQueryBuilder('user')
      .leftJoin('user.userGroup', 'user_group')
      .leftJoin('user.groupAchievement', 'group_achievement')
      .select([
        'user.avatarUrl as avatarUrl',
        'user.userCode as userCode',
        'user_group.grade as grade',
      ])
      .addSelect('MAX(group_achievement.created_at)', 'lastChallenged')
      .andWhere('user_group.group.id = :groupId', { groupId })
      .groupBy('user.id')
      .addGroupBy('user_group.grade')
      .getRawMany<IGroupUserInfo>();
    return groupUsersInfo.map(
      (groupUserInfo) => new GroupUserInfo(groupUserInfo),
    );
  }
}
