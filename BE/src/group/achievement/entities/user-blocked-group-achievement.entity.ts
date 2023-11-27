import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from '../../../users/entities/user.entity';
import { GroupAchievementEntity } from './group-achievement.entity';
import { BaseTimeEntity } from '../../../common/entities/base.entity';
import { UserBlockedGroupAchievement } from '../domain/user-blocked-group-achievement.domain';

@Entity({ name: 'user_blocked_group_achievement' })
export class UserBlockedGroupAchievementEntity extends BaseTimeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: UserEntity;

  @ManyToOne(() => GroupAchievementEntity)
  @JoinColumn({ name: 'group_achievement_id', referencedColumnName: 'id' })
  groupAchievement: GroupAchievementEntity;

  toModel(): UserBlockedGroupAchievement {
    return new UserBlockedGroupAchievement(
      this.user?.toModel() || null,
      this.groupAchievement?.toModel() || null,
    );
  }

  static from(
    userBlockedGroupAchievement: UserBlockedGroupAchievement,
  ): UserBlockedGroupAchievementEntity {
    const userBlockedGroupAchievementEntity =
      new UserBlockedGroupAchievementEntity();
    userBlockedGroupAchievementEntity.user = userBlockedGroupAchievement.user
      ? UserEntity.from(userBlockedGroupAchievement.user)
      : null;
    userBlockedGroupAchievementEntity.groupAchievement =
      userBlockedGroupAchievement.groupAchievement
        ? GroupAchievementEntity.from(
            userBlockedGroupAchievement.groupAchievement,
          )
        : null;
    return userBlockedGroupAchievementEntity;
  }
}
