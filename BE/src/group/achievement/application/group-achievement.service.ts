import { Injectable } from '@nestjs/common';
import { GroupAchievementRepository } from '../entities/group-achievement.repository';
import { UserBlockedGroupAchievementRepository } from '../entities/user-blocked-group-achievement.repository';
import { UserBlockedGroupAchievement } from '../domain/user-blocked-group-achievement.domain';
import { User } from '../../../users/domain/user.domain';
import { RejectGroupAchievementResponse } from '../dto/reject-group-achievement-response.dto';
import { NoSuchGroupAchievementException } from '../exception/no-such-group-achievement.exception';
import { InvalidRejectRequestException } from '../exception/invalid-reject-request.exception';

@Injectable()
export class GroupAchievementService {
  constructor(
    private readonly groupAchievementRepository: GroupAchievementRepository,
    private readonly userBlockedGroupAchievementRepository: UserBlockedGroupAchievementRepository,
  ) {}
  async reject(user: User, groupId: number, achievementId: number) {
    const achievement =
      await this.groupAchievementRepository.findById(achievementId);
    if (!achievement) throw new NoSuchGroupAchievementException();
    if (achievement.group.id !== groupId)
      throw new InvalidRejectRequestException();

    const userBlockedGroupAchievement =
      await this.userBlockedGroupAchievementRepository.saveUserBlockedGroupAchievement(
        new UserBlockedGroupAchievement(user, achievement),
      );

    return RejectGroupAchievementResponse.from(userBlockedGroupAchievement);
  }
}
