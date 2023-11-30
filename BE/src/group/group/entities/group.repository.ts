import { TransactionalRepository } from '../../../config/transaction-manager/transactional-repository';
import { GroupEntity } from './group.entity';
import { CustomRepository } from '../../../config/typeorm/custom-repository.decorator';
import { Group } from '../domain/group.domain';
import { IGroupPreview } from '../index';
import { GroupPreview } from '../dto/group-preview.dto';

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
      ])
      .addSelect('COUNT(achievements.id)', 'continued')
      .addSelect('MAX(achievements.created_at)', 'lastChallenged')
      .where('user_group.user_id = :userId', { userId })
      .groupBy('group.id')
      .getRawMany<IGroupPreview>();

    return groupPreviews.map((groupPreview) => new GroupPreview(groupPreview));
  }
}
