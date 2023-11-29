import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BaseTimeEntity } from '../../common/entities/base.entity';
import { User } from '../domain/user.domain';
import { UsersRoleEntity } from './users-role.entity';
import { isNullOrUndefined } from '../../common/utils/is-null-or-undefined';

@Entity({ name: 'user' })
export class UserEntity extends BaseTimeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  avatarUrl: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  userCode: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  userIdentifier: string;

  @OneToMany(() => UsersRoleEntity, (userRole) => userRole.user, {
    cascade: ['insert'],
  })
  userRoles: UsersRoleEntity[];

  static from(user: User): UserEntity {
    if (isNullOrUndefined(user)) return user;

    const userEntity = new UserEntity();
    userEntity.id = user.id;
    userEntity.userIdentifier = user.userIdentifier;
    userEntity.avatarUrl = user.avatarUrl;
    userEntity.userCode = user.userCode;
    userEntity.userRoles = user.roles?.map((role) => {
      return new UsersRoleEntity(userEntity, role);
    });
    return userEntity;
  }

  toModel() {
    const user = new User();
    user.id = this.id;
    user.avatarUrl = this.avatarUrl;
    user.userIdentifier = this.userIdentifier;
    user.userCode = this.userCode;
    user.id = this.id;
    user.roles = this.userRoles?.map((userRole) => userRole.role);
    return user;
  }
}
