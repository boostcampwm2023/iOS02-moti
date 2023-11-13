import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { PrimaryColumn } from 'typeorm';
import { UserEntity } from './user.entity';
import { RoleEntity } from './role.entity';

@Entity({ name: 'users_role' })
export class UsersRoleEntity {
  @PrimaryColumn({ type: 'bigint', nullable: false })
  userId: number;

  @PrimaryColumn({ type: 'int', nullable: false })
  roleId: number;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: UserEntity;

  @ManyToOne(() => RoleEntity)
  @JoinColumn({ name: 'role_id', referencedColumnName: 'id' })
  role: RoleEntity;
}
