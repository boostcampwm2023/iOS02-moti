import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';
import { AdminStatus } from '../domain/admin-status';
import { Admin } from '../domain/admin.domain';

@Entity({ name: 'admin' })
export class AdminEntity {
  @PrimaryColumn()
  userId: number;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: UserEntity;

  @Column({ type: 'varchar', length: 100, nullable: false, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 100 })
  password: string;

  @Column({
    type: 'simple-enum',
    enum: AdminStatus,
    default: AdminStatus.PENDING,
  })
  status: AdminStatus;

  static from(admin: Admin) {
    const adminEntity = new AdminEntity();
    adminEntity.user = UserEntity.from(admin.user);
    adminEntity.userId = admin.user.id;
    adminEntity.email = admin.email;
    adminEntity.password = admin.password;
    adminEntity.status = admin.status;
    return adminEntity;
  }

  toModel(): Admin {
    const admin = new Admin(this.user?.toModel(), this.email, this.password);
    admin.status = this.status;
    return admin;
  }
}
