import { CustomRepository } from '../../../config/typeorm/custom-repository.decorator';
import { GroupAchievementEmojiEntity } from './group-achievement-emoji.entity';
import { TransactionalRepository } from '../../../config/transaction-manager/transactional-repository';
import { GroupAchievementEmoji } from '../domain/group-achievement-emoji.domain';
import { User } from '../../../users/domain/user.domain';
import { Emoji } from '../domain/emoji';
import { IGroupAchievementEmojiMetadata } from '../dto';
import { GroupAchievementEmojiListElement } from '../dto/group-achievement-emoji-list-element';

@CustomRepository(GroupAchievementEmojiEntity)
export class GroupAchievementEmojiRepository extends TransactionalRepository<GroupAchievementEmojiEntity> {
  async saveGroupAchievementEmoji(
    groupAchievementEmoji: GroupAchievementEmoji,
  ): Promise<GroupAchievementEmoji> {
    const groupAchievementEntity = GroupAchievementEmojiEntity.from(
      groupAchievementEmoji,
    );
    const groupAchievementEmojiEntity = await this.repository.save(
      groupAchievementEntity,
    );

    return groupAchievementEmojiEntity.toModel();
  }

  async deleteGroupAchievementEmoji(
    groupAchievementEmoji: GroupAchievementEmoji,
  ): Promise<void> {
    const groupAchievementEntity = GroupAchievementEmojiEntity.from(
      groupAchievementEmoji,
    );
    await this.repository.remove(groupAchievementEntity);
  }

  async getGroupAchievementEmojiByGroupAchievementIdAndUserAndEmoji(
    groupAchievementId: number,
    user: User,
    emoji: Emoji,
  ): Promise<GroupAchievementEmoji> {
    const findOne = await this.repository
      .createQueryBuilder('gae')
      .select('gae')
      .where('gae.group_achievement_id = :groupAchievementId', {
        groupAchievementId,
      })
      .andWhere('gae.emoji = :emoji', { emoji })
      .andWhere('gae.user_id = :userId', { userId: user.id })
      .getOne();

    return findOne?.toModel();
  }

  async findGroupAchievementEmojiMetaData(
    user: User,
    groupAchievementId: number,
    emoji: Emoji,
  ) {
    const metadata = await this.repository
      .createQueryBuilder('gae')
      .select('COUNT(gae.id)', 'count')
      .where('gae.group_achievement_id = :groupAchievementId', {
        groupAchievementId,
      })
      .andWhere('gae.emoji = :emoji', { emoji: emoji })
      .groupBy('gae.groupAchievement')
      .getRawOne<IGroupAchievementEmojiMetadata>();

    const userEmoji = await this.findGroupAchievementEmojiByUser(
      groupAchievementId,
      user,
      emoji,
    );

    return GroupAchievementEmojiListElement.of(
      emoji,
      isNaN(parseInt(metadata?.count)) ? 0 : parseInt(metadata.count),
      userEmoji != null,
    );
  }

  async findGroupAchievementEmojiByUser(
    groupAchievementId: number,
    user: User,
    emoji: Emoji,
  ) {
    const groupAchievementEmojiEntity = await this.repository.findOne({
      where: {
        user: {
          id: user.id,
        },
        groupAchievement: {
          id: groupAchievementId,
        },
        emoji: emoji,
      },
    });

    return groupAchievementEmojiEntity?.toModel();
  }
}
