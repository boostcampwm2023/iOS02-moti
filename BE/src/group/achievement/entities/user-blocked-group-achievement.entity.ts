import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from '../../../users/entities/user.entity';
import { GroupAchievementEntity } from './group-achievement.entity';
import { BaseTimeEntity } from '../../../common/entities/base.entity';
import { UserBlockedGroupAchievement } from '../domain/user-blocked-group-achievement.domain';
import { isNullOrUndefined } from '../../../common/utils/is-null-or-undefined';

@Entity({ name: 'user_blocked_group_achievement' })
export class UserBlockedGroupAchievementEntity extends BaseTimeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: UserEntity;

  @ManyToOne(() => GroupAchievementEntity)
  @JoinColumn({ name: 'group_achievement_id', referencedColumnName: 'id' })
  groupAchievement: GroupAchievementEntity;

  toModel(): UserBlockedGroupAchievement {
    return new UserBlockedGroupAchievement(
      this.user?.toModel(),
      this.groupAchievement?.toModel(),
    );
  }

  static from(
    userBlockedGroupAchievement: UserBlockedGroupAchievement,
  ): UserBlockedGroupAchievementEntity {
    if (isNullOrUndefined(userBlockedGroupAchievement))
      return userBlockedGroupAchievement;

    const userBlockedGroupAchievementEntity =
      new UserBlockedGroupAchievementEntity();
    userBlockedGroupAchievementEntity.user = UserEntity.from(
      userBlockedGroupAchievement.user,
    );
    userBlockedGroupAchievementEntity.groupAchievement =
      GroupAchievementEntity.from(userBlockedGroupAchievement.groupAchievement);
    return userBlockedGroupAchievementEntity;
  }
}
