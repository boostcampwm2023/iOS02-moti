import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { UserEntity } from './user.entity';
import { BaseTimeEntity } from '../../common/entities/base.entity';
import { UserBlockedUser } from '../domain/user-blocked-user.domain';
import { isNullOrUndefined } from '../../common/utils/is-null-or-undefined';

@Entity({ name: 'user_blocked_user' })
export class UserBlockedUserEntity extends BaseTimeEntity {
  @PrimaryColumn({ type: 'bigint', nullable: false })
  userId: number;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
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

  setBlockedUser(userBlockedUser: UserEntity) {
    this.blockedUser = userBlockedUser;
    this.blockedUserId = userBlockedUser?.id;
  }

  static from(userBlockedUser: UserBlockedUser): UserBlockedUserEntity {
    if (isNullOrUndefined(userBlockedUser)) return userBlockedUser;

    const userBlockedUserEntity = new UserBlockedUserEntity();
    userBlockedUserEntity.user = UserEntity.from(userBlockedUser.user);
    userBlockedUserEntity.userId = userBlockedUser.user?.id || null;
    userBlockedUserEntity.setBlockedUser(
      UserEntity.from(userBlockedUser.blockedUser),
    );
    return userBlockedUserEntity;
  }
}
