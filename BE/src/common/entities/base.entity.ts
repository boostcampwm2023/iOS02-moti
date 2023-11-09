import {
  BaseEntity,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export abstract class BaseTimeEntity extends BaseEntity {
  @CreateDateColumn({ type: 'datetime' })
  public readonly createdAt!: Date;

  @UpdateDateColumn({ type: 'datetime' })
  public readonly updateAt!: Date;

  @DeleteDateColumn({ type: 'datetime', nullable: true })
  public readonly deletedAt?: Date;
}
