import { CustomRepository } from '../../config/typeorm/custom-repository.decorator';
import { MotiPolicyEntity } from './moti-policy.entity';
import { MotiPolicy } from '../domain/moti-policy.domain';
import { TransactionalRepository } from '../../config/transaction-manager/transactional-repository';

@CustomRepository(MotiPolicyEntity)
export class MotiPolicyRepository extends TransactionalRepository<MotiPolicyEntity> {
  async findLatestPolicy(): Promise<MotiPolicy> {
    const versionEntity = await this.repository.findOne({
      where: {},
      order: { latest: 'DESC' },
    });
    return versionEntity?.toModel();
  }

  async savePolicy(motiPolicy: MotiPolicy): Promise<MotiPolicy> {
    const initPolicy = MotiPolicyEntity.from(motiPolicy);
    await this.repository.save(initPolicy);
    return initPolicy.toModel();
  }
}
