import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { UserEntity } from './user.entity';
import { BaseTimeEntity } from '../../common/entities/base.entity';
import { UserBlockedUser } from '../domain/user-blocked-user.domain';

@Entity({ name: 'user_blocked_user' })
export class UserBlockedUserEntity extends BaseTimeEntity {
  @PrimaryColumn({ type: 'bigint', nullable: false })
  userId: number;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: UserEntity;

  @PrimaryColumn()
  blockedUserId: number;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'blocked_user_id', referencedColumnName: 'id' })
  blockedUser: UserEntity;

  toModel(): UserBlockedUser {
    return new UserBlockedUser(
      this.user?.toModel() || null,
      this.blockedUser?.toModel() || null,
    );
  }

  static from(userBlockedUser: UserBlockedUser): UserBlockedUserEntity {
    const userBlockedUserEntity = new UserBlockedUserEntity();
    userBlockedUserEntity.user = userBlockedUser.user
      ? UserEntity.from(userBlockedUser.user)
      : null;
    userBlockedUserEntity.userId = userBlockedUser.user?.id || null;
    userBlockedUserEntity.blockedUser = userBlockedUser.blockedUser
      ? UserEntity.from(userBlockedUser.blockedUser)
      : null;
    userBlockedUserEntity.blockedUserId = userBlockedUser.blockedUser?.id || null;
    return userBlockedUserEntity;
  }
}
