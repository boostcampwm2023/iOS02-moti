import { Injectable } from '@nestjs/common';
import { MotiPolicyRepository } from '../entities/moti-policy.repository';
import { MotiPolicy } from '../domain/moti-policy.domain';
import {
  MotimateException,
  VERSION_ALREADY_EXISTS,
  VERSION_NOT_FOUND,
} from '../../common/exception/motimate.excpetion';
import { MotiPolicyCreate } from '../dto/moti-policy-create';

@Injectable()
export class OperateService {
  constructor(private readonly motiVersionRepository: MotiPolicyRepository) {}

  async retrieveMotimateOperation(): Promise<MotiPolicy> {
    return this.getLatestVersion();
  }

  async initMotiPolicy(motiPolicyCreate: MotiPolicyCreate) {
    const currentPolicy = await this.motiVersionRepository.findLatestPolicy();
    if (currentPolicy) throw new MotimateException(VERSION_ALREADY_EXISTS);

    const initPolicy = motiPolicyCreate.toModel();
    return this.motiVersionRepository.save(initPolicy);
  }

  private async getLatestVersion(): Promise<MotiPolicy> {
    const currentPolicy = await this.motiVersionRepository.findLatestPolicy();
    if (!currentPolicy) throw new MotimateException(VERSION_NOT_FOUND);

    return currentPolicy;
  }
}
