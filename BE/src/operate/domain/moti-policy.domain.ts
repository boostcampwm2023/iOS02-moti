import { MotiPolicyUpdate } from '../dto';

export class MotiPolicy {
  id: number;
  latest: string;
  required: string;
  privacyPolicy: string;

  constructor(latest: string, required: string, privacyPolicy: string) {
    this.latest = latest;
    this.required = required;
    this.privacyPolicy = privacyPolicy;
  }

  update(motiPolicyUpdate: MotiPolicyUpdate) {
    this.latest = motiPolicyUpdate.latest || this.latest;
    this.required = motiPolicyUpdate.required || this.required;
    this.privacyPolicy = motiPolicyUpdate.privacyPolicy || this.privacyPolicy;
  }
}
