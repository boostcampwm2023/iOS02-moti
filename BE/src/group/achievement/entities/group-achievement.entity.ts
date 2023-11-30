import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseTimeEntity } from '../../../common/entities/base.entity';
import { UserEntity } from '../../../users/entities/user.entity';
import { GroupCategoryEntity } from '../../category/entities/group-category.entity';
import { GroupEntity } from '../../group/entities/group.entity';
import { GroupAchievement } from '../domain/group-achievement.domain';

@Entity({ name: 'group_achievement' })
export class GroupAchievementEntity extends BaseTimeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100, nullable: false })
  title: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: UserEntity;

  @ManyToOne(() => GroupEntity)
  @JoinColumn({ name: 'group_id', referencedColumnName: 'id' })
  group: GroupEntity;

  @ManyToOne(() => GroupCategoryEntity)
  @JoinColumn({ name: 'group_category_id', referencedColumnName: 'id' })
  groupCategory: GroupCategoryEntity;

  @Column({ type: 'text' })
  content: string;

  toModel(): GroupAchievement {
    const groupAchievement = new GroupAchievement(
      this.title,
      this.user?.toModel() || null,
      this.group?.toModel() || null,
      this.groupCategory?.toModel() || null,
      this.content,
    );
    groupAchievement.id = this.id;
    groupAchievement.createdAt = this.createdAt;
    return groupAchievement;
  }

  static from(groupAchievement: GroupAchievement): GroupAchievementEntity {
    const groupAchievementEntity = new GroupAchievementEntity();
    groupAchievementEntity.id = groupAchievement.id;
    groupAchievementEntity.title = groupAchievement.title;
    groupAchievementEntity.user = groupAchievement.user
      ? UserEntity.from(groupAchievement.user)
      : null;
    groupAchievementEntity.group = groupAchievement.group
      ? GroupEntity.from(groupAchievement.group)
      : null;
    groupAchievementEntity.groupCategory = groupAchievement.groupCategory
      ? GroupCategoryEntity.from(groupAchievement.groupCategory)
      : null;
    groupAchievementEntity.content = groupAchievement.content;
    return groupAchievementEntity;
  }
}
