import { TransactionalRepository } from '../../../config/transaction-manager/transactional-repository';
import { CustomRepository } from '../../../config/typeorm/custom-repository.decorator';
import { GroupCategoryEntity } from './group-category.entity';
import { GroupCategory } from '../domain/group.category';

@CustomRepository(GroupCategoryEntity)
export class GroupCategoryRepository extends TransactionalRepository<GroupCategoryEntity> {
  async saveGroupCategory(groupCategory: GroupCategory) {
    const newGroupCategory = GroupCategoryEntity.from(groupCategory);
    await this.repository.save(newGroupCategory);
    return newGroupCategory.toModel();
  }
}
