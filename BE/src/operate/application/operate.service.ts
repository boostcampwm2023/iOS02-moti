import { Injectable } from '@nestjs/common';
import { MotiPolicyRepository } from '../entities/moti-policy.repository';
import { MotiPolicy } from '../domain/moti-policy.domain';
import { MotiPolicyCreate } from '../dto/moti-policy-create';
import { Transactional } from '../../config/transaction-manager';
import { PolicyAlreadyExistsException } from '../exception/policy-already-exists.exception';
import { PolicyNotFoundException } from '../exception/policy-not-found.exception';
import { MotiPolicyUpdate } from '../dto';

@Injectable()
export class OperateService {
  constructor(private readonly motiVersionRepository: MotiPolicyRepository) {}

  async retrieveMotimateOperation(): Promise<MotiPolicy> {
    return this.getLatestVersion();
  }

  @Transactional()
  async initMotiPolicy(motiPolicyCreate: MotiPolicyCreate) {
    const currentPolicy = await this.motiVersionRepository.findLatestPolicy();
    if (currentPolicy) throw new PolicyAlreadyExistsException();

    const initPolicy = motiPolicyCreate.toModel();
    return this.motiVersionRepository.savePolicy(initPolicy);
  }

  @Transactional()
  async updateMotiPolicy(updateMotiPolicy: MotiPolicyUpdate) {
    const currentPolicy = await this.motiVersionRepository.findLatestPolicy();
    if (!currentPolicy) throw new PolicyNotFoundException();

    currentPolicy.update(updateMotiPolicy);
    return this.motiVersionRepository.savePolicy(currentPolicy);
  }

  @Transactional({ readonly: true })
  private async getLatestVersion(): Promise<MotiPolicy> {
    const currentPolicy = await this.motiVersionRepository.findLatestPolicy();
    if (!currentPolicy) throw new PolicyNotFoundException();

    return currentPolicy;
  }
}
