import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { UserEntity } from './user.entity';
import { UserRole } from '../domain/user-role';

@Entity({ name: 'user_role' })
export class UsersRoleEntity {
  @PrimaryColumn({ type: 'bigint', nullable: false })
  userId: number;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: UserEntity;

  @PrimaryColumn({
    type: 'simple-enum',
    enum: UserRole,
    default: UserRole.MEMBER,
  })
  role: UserRole = UserRole.MEMBER;

  constructor(user: UserEntity, role: UserRole) {
    this.user = user;
    this.userId = user?.id;
    this.role = role;
  }

  toModel(): UserRole {
    return this.role;
  }
}
