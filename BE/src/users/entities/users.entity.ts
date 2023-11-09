import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { BaseTimeEntity } from '../../common/entities/base.entity';

@Entity({ name: 'users' })
export class UsersEntity extends BaseTimeEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'varchar', length: 320, nullable: false })
  email: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  avatar: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  userCode: string;
}
