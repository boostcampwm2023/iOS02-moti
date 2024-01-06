import { TransactionalRepository } from '../../../config/transaction-manager/transactional-repository';
import { GroupEntity } from './group.entity';
import { CustomRepository } from '../../../config/typeorm/custom-repository.decorator';
import { Group } from '../domain/group.domain';
import { IGroupPreview } from '../index';
import { GroupPreview } from '../dto/group-preview.dto';
import { User } from '../../../users/domain/user.domain';
import { UserGroupGrade } from '../domain/user-group-grade';
import { In } from 'typeorm';

@CustomRepository(GroupEntity)
export class GroupRepository extends TransactionalRepository<GroupEntity> {
  async saveGroup(group: Group): Promise<Group> {
    const newGroup = GroupEntity.from(group);
    await this.repository.save(newGroup);
    return newGroup.toModel();
  }

  async findByUserId(userId: number) {
    const groupPreviews = await this.repository
      .createQueryBuilder('group')
      .leftJoin('group.userGroups', 'user_group')
      .leftJoin('group.achievements', 'achievements')
      .select([
        'group.id as id',
        'group.name as name',
        'group.avatarUrl as avatarUrl',
        'group.groupCode as groupCode',
        'user_group.grade as grade',
        'user_group.seq as seq',
      ])
      .addSelect('COUNT(achievements.id)', 'continued')
      .addSelect('MAX(achievements.created_at)', 'lastChallenged')
      .where('user_group.user_id = :userId', { userId })
      .orderBy('user_group.seq')
      .groupBy('group.id')
      .addGroupBy('user_group.grade')
      .addGroupBy('user_group.seq')
      .getRawMany<IGroupPreview>();

    console.log(groupPreviews);
    return groupPreviews.map((groupPreview) => new GroupPreview(groupPreview));
  }

  async findById(id: number) {
    const group = await this.repository.findOne({
      where: {
        id: id,
      },
    });
    return group?.toModel();
  }

  async findGroupByIdAndLeaderUser(user: User, id: number): Promise<Group> {
    const group = await this.repository.findOne({
      where: {
        id: id,
        userGroups: {
          user: {
            id: user.id,
          },
          grade: UserGroupGrade.LEADER,
        },
      },
      relations: ['userGroups.user'],
    });
    return group?.toModel();
  }

  async findByIdAndUser(id: number, user: User): Promise<Group> {
    const group = await this.repository.findOne({
      where: {
        id: id,
        userGroups: {
          user: {
            id: user.id,
          },
        },
      },
      relations: ['userGroups.user'],
    });
    return group?.toModel();
  }

  async findByGroupCode(groupCode: string) {
    const group = await this.repository.findOne({
      where: {
        groupCode: groupCode,
      },
    });
    return group?.toModel();
  }

  async existByGroupCode(groupCode: string) {
    return await this.repository.exist({ where: { groupCode: groupCode } });
  }

  async findAllByIdAndUser(userId: number, ids: number[]): Promise<Group[]> {
    const groups = await this.repository
      .createQueryBuilder('g')
      .where('g.user_id = :userId')
      .andWhere({ id: In(ids) })
      .setParameter('userId', userId)
      .orderBy(`FIELD(g.id, :...ids)`)
      .setParameter('ids', ids)
      .getMany();

    return groups.map((g) => g.toModel());
  }
}
