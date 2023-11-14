import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseTimeEntity } from '../../common/entities/base.entity';
import { User } from '../domain/user.domain';

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

  static from(user: User) {
    const userEntity = new UserEntity();
    userEntity.id = user.id;
    userEntity.userIdentifier = user.userIdentifier;
    userEntity.avatarUrl = user.avatarUrl;
    userEntity.userCode = user.userCode;
    return userEntity;
  }

  toModel() {
    const user = new User();
    user.id = this.id;
    user.avatarUrl = this.avatarUrl;
    user.userIdentifier = this.userIdentifier;
    user.userCode = this.userCode;
    user.id = this.id;
    return user;
  }
}
