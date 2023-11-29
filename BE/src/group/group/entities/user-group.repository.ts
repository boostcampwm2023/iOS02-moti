import { TransactionalRepository } from '../../../config/transaction-manager/transactional-repository';
import { CustomRepository } from '../../../config/typeorm/custom-repository.decorator';
import { UserGroupEntity } from './user-group.entity';

@CustomRepository(UserGroupEntity)
export class UserGroupRepository extends TransactionalRepository<UserGroupEntity> {}
