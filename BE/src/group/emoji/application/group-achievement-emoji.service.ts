import { Injectable } from '@nestjs/common';
import { GroupAchievementEmojiRepository } from '../entities/group-achievement-emoji.repository';
import { Transactional } from '../../../config/transaction-manager';
import { User } from '../../../users/domain/user.domain';
import { Emoji } from '../domain/emoji';
import { GroupAchievementRepository } from '../../achievement/entities/group-achievement.repository';
import { UnauthorizedAchievementException } from '../../../achievement/exception/unauthorized-achievement.exception';
import { GroupAchievementEmoji } from '../domain/group-achievement-emoji.domain';
import { UserGroupRepository } from '../../group/entities/user-group.repository';
import { NoSuchGroupUserException } from '../../achievement/exception/no-such-group-user.exception';
import { GroupAchievementEmojiResponse } from '../dto/group-achievement-emoji-response';

@Injectable()
export class GroupAchievementEmojiService {
  constructor(
    private readonly groupAchievementEmojiRepository: GroupAchievementEmojiRepository,
    private readonly userGroupRepository: UserGroupRepository,
    private readonly groupAchievementRepository: GroupAchievementRepository,
  ) {}

  @Transactional()
  async toggleAchievementEmoji(
    user: User,
    groupId: number,
    achievementId: number,
    emoji: Emoji,
  ) {
    await this.validateUserGroup(user, groupId);
    const groupAchievement = await this.getGroupAchievement(
      groupId,
      achievementId,
    );
    const groupAchievementEmoji =
      await this.groupAchievementEmojiRepository.getGroupAchievementEmojiByGroupAchievementIdAndUserAndEmoji(
        groupAchievement.id,
        user,
        emoji,
      );

    if (groupAchievementEmoji) {
      await this.groupAchievementEmojiRepository.deleteGroupAchievementEmoji(
        groupAchievementEmoji,
      );
      return GroupAchievementEmojiResponse.of(emoji, false);
    } else {
      const newGroupAchievementEmoji = new GroupAchievementEmoji(
        groupAchievement,
        user,
        emoji,
      );
      await this.groupAchievementEmojiRepository.saveGroupAchievementEmoji(
        newGroupAchievementEmoji,
      );
      return GroupAchievementEmojiResponse.of(emoji, true);
    }
  }

  private async getGroupAchievement(groupId: number, achievementId: number) {
    const grouopAchievement =
      await this.groupAchievementRepository.findOneByIdAndGroupId(
        achievementId,
        groupId,
      );
    if (!grouopAchievement) throw new UnauthorizedAchievementException();
    return grouopAchievement;
  }

  private async validateUserGroup(user: User, groupId: number) {
    const userGroup =
      await this.userGroupRepository.findOneByUserCodeAndGroupId(
        user.userCode,
        groupId,
      );
    if (!userGroup) throw new NoSuchGroupUserException();
  }
}
