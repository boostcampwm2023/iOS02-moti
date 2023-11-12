import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { MotiPolicy } from '../domain/moti-policy.domain';

@Entity({ name: 'moti_version' })
export class MotiPolicyEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 20 })
  latest: string;

  @Column({ type: 'varchar', length: 20 })
  required: string;

  @Column({ type: 'varchar', length: 200 })
  privacyPolicy: string;

  toModel(): MotiPolicy {
    const motiPolicy = new MotiPolicy(
      this.latest,
      this.required,
      this.privacyPolicy,
    );
    motiPolicy.id = this.id;
    return motiPolicy;
  }

  static from(motiPolicy: MotiPolicy): MotiPolicyEntity {
    const motiPolicyEntity = new MotiPolicyEntity();
    motiPolicyEntity.id = motiPolicy.id;
    motiPolicyEntity.latest = motiPolicy.latest;
    motiPolicyEntity.required = motiPolicy.required;
    motiPolicyEntity.privacyPolicy = motiPolicy.privacyPolicy;
    return motiPolicyEntity;
  }
}
