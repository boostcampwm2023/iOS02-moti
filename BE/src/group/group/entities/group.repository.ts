import { TransactionalRepository } from '../../../config/transaction-manager/transactional-repository';
import { GroupEntity } from './group.entity';
import { CustomRepository } from '../../../config/typeorm/custom-repository.decorator';
import { Group } from '../domain/group.domain';

@CustomRepository(GroupEntity)
export class GroupRepository extends TransactionalRepository<GroupEntity> {
  async saveGroup(group: Group): Promise<Group> {
    const newGroup = GroupEntity.from(group);
    await this.repository.save(newGroup);
    return newGroup.toModel();
  }
}
