import { TransactionalRepository } from '../../../config/transaction-manager/transactional-repository';
import { GroupEntity } from './group.entity';
import { CustomRepository } from '../../../config/typeorm/custom-repository.decorator';
import { Group } from '../domain/group.domain';
import { IGroupPreview } from '../index';
import { GroupPreview } from '../dto/group-preview.dto';
import { User } from '../../../users/domain/user.domain';
import { UserGroupGrade } from '../domain/user-group-grade';

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
        'user_group.grade as grade',
      ])
      .addSelect('COUNT(achievements.id)', 'continued')
      .addSelect('MAX(achievements.created_at)', 'lastChallenged')
      .where('user_group.user_id = :userId', { userId })
      .groupBy('group.id')
      .addGroupBy('user_group.grade')
      .getRawMany<IGroupPreview>();

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
}
