import { CustomRepository } from '../../config/typeorm/custom-repository.decorator';
import { MotiPolicyEntity } from './moti-policy.entity';
import { Repository } from 'typeorm';
import { MotiPolicy } from '../domain/moti-policy.domain';

@CustomRepository(MotiPolicyEntity)
export class MotiPolicyRepository extends Repository<MotiPolicyEntity> {
  async findLatestPolicy(): Promise<MotiPolicy> {
    const versionEntity = await this.findOne({
      where: {},
      order: { latest: 'DESC' },
    });
    return versionEntity?.toModel();
  }

  async savePolicy(motiPolicy: MotiPolicy): Promise<MotiPolicy> {
    const initPolicy = MotiPolicyEntity.from(motiPolicy);
    const savedPolicy = await this.save(initPolicy);
    return savedPolicy.toModel();
  }
}
