import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { GroupAchievementEntity } from '../../achievement/entities/group-achievement.entity';
import { UserEntity } from '../../../users/entities/user.entity';
import { Emoji } from '../domain/emoji';
import { GroupAchievementEmoji } from '../domain/group-achievement-emoji.domain';
import { isNullOrUndefined } from '../../../common/utils/is-null-or-undefined';

@Entity({ name: 'group_achievement_emoji' })
export class GroupAchievementEmojiEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => GroupAchievementEntity)
  @JoinColumn({ name: 'group_achievement_id', referencedColumnName: 'id' })
  groupAchievement: GroupAchievementEntity;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: UserEntity;

  @Column({
    type: 'simple-enum',
    enum: Emoji,
  })
  emoji: Emoji;

  static from(
    groupAchievementEmoji: GroupAchievementEmoji,
  ): GroupAchievementEmojiEntity {
    if (isNullOrUndefined(groupAchievementEmoji)) return groupAchievementEmoji;

    const entity = new GroupAchievementEmojiEntity();
    entity.id = groupAchievementEmoji.id;
    entity.groupAchievement = GroupAchievementEntity.from(
      groupAchievementEmoji.groupAchievement,
    );
    entity.user = UserEntity.from(groupAchievementEmoji.user);
    entity.emoji = groupAchievementEmoji.emoji;
    return entity;
  }

  toModel() {
    const entity = new GroupAchievementEmoji(
      this.groupAchievement?.toModel(),
      this.user?.toModel(),
      this.emoji,
    );
    entity.id = this.id;
    entity.emoji = this.emoji;
    return entity;
  }
}
