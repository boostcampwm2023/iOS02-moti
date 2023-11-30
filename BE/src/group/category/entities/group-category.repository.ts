import { GroupCategoryEntity } from './group-category.entity';
import { CustomRepository } from '../../../config/typeorm/custom-repository.decorator';
import { TransactionalRepository } from '../../../config/transaction-manager/transactional-repository';
import { GroupCategory } from '../domain/group.category';

@CustomRepository(GroupCategoryEntity)
export class GroupCategoryRepository extends TransactionalRepository<GroupCategoryEntity> {
  async saveGroupCategory(groupCtg: GroupCategory): Promise<GroupCategory> {
    const groupCategoryEntity = GroupCategoryEntity.from(groupCtg);

    const saved = await this.repository.save(groupCategoryEntity);
    return saved.toModel();
  }
}
