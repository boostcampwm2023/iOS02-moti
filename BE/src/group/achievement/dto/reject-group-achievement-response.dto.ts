import { UserBlockedGroupAchievement } from '../domain/user-blocked-group-achievement.domain';
import { ApiProperty } from '@nestjs/swagger';

export class RejectGroupAchievementResponse {
  @ApiProperty({ description: '유저 아이디' })
  userId: number;
  @ApiProperty({ description: '달성기록 아이디' })
  groupAchievementId: number;

  constructor(userId: number, groupAchievementId: number) {
    this.userId = userId;
    this.groupAchievementId = groupAchievementId;
  }

  static from(userBlockedGroupAchievement: UserBlockedGroupAchievement) {
    return new RejectGroupAchievementResponse(
      userBlockedGroupAchievement.user.id,
      userBlockedGroupAchievement.groupAchievement.id,
    );
  }
}
