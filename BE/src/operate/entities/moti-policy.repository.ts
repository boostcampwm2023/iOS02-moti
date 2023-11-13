import { CustomRepository } from '../../config/typeorm/custom-repository.decorator';
import { MotiPolicyEntity } from './moti-policy.entity';
import { Repository } from 'typeorm';
import { MotiPolicy } from '../domain/moti-policy.domain';
import { retrieveQueryRunner } from '../../config/transaction-manager';

@CustomRepository(MotiPolicyEntity)
export class MotiPolicyRepository extends Repository<MotiPolicyEntity> {
  async findLatestPolicy(): Promise<MotiPolicy> {
    const repository = this.getRepository();
    const versionEntity = await repository.findOne({
      where: {},
      order: { latest: 'DESC' },
    });
    return versionEntity?.toModel();
  }

  async savePolicy(motiPolicy: MotiPolicy): Promise<MotiPolicy> {
    const repository = this.getRepository();
    const initPolicy = MotiPolicyEntity.from(motiPolicy);
    await repository.save(initPolicy);
    return initPolicy.toModel();
  }

  private getRepository(): Repository<MotiPolicyEntity> {
    return (
      retrieveQueryRunner()?.manager.getRepository(MotiPolicyEntity) || this
    );
  }
}
