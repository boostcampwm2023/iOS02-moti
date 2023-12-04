import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseTimeEntity } from '../../../common/entities/base.entity';
import { UserEntity } from '../../../users/entities/user.entity';
import { GroupCategoryEntity } from '../../category/entities/group-category.entity';
import { GroupEntity } from '../../group/entities/group.entity';
import { GroupAchievement } from '../domain/group-achievement.domain';
import { isNullOrUndefined } from '../../../common/utils/is-null-or-undefined';
import { ImageEntity } from '../../../image/entities/image.entity';

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

  @OneToOne(() => ImageEntity, (image) => image.groupAchievement, {
    eager: true,
  })
  image: ImageEntity;

  toModel(): GroupAchievement {
    const groupAchievement = new GroupAchievement(
      this.title,
      this.user?.toModel(),
      this.group?.toModel(),
      this.groupCategory?.toModel(),
      this.content,
      this.image?.toModel(),
    );
    groupAchievement.id = this.id;
    groupAchievement.createdAt = this.createdAt;
    return groupAchievement;
  }

  static from(groupAchievement: GroupAchievement): GroupAchievementEntity {
    if (isNullOrUndefined(groupAchievement)) return groupAchievement;

    const groupAchievementEntity = new GroupAchievementEntity();
    groupAchievementEntity.id = groupAchievement.id;
    groupAchievementEntity.title = groupAchievement.title;
    groupAchievementEntity.user = UserEntity.from(groupAchievement.user);
    groupAchievementEntity.group = GroupEntity.from(groupAchievement.group);
    groupAchievementEntity.groupCategory = GroupCategoryEntity.from(
      groupAchievement.groupCategory,
    );
    groupAchievementEntity.content = groupAchievement.content;
    groupAchievementEntity.image = ImageEntity.strictFrom(
      groupAchievement.image,
    );
    return groupAchievementEntity;
  }

  static strictFrom(
    groupAchievement: GroupAchievement,
  ): GroupAchievementEntity {
    if (isNullOrUndefined(groupAchievement)) return groupAchievement;

    const groupAchievementEntity = new GroupAchievementEntity();
    groupAchievementEntity.id = groupAchievement.id;
    groupAchievementEntity.title = groupAchievement.title;
    groupAchievementEntity.user = UserEntity.from(groupAchievement.user);
    groupAchievementEntity.group = GroupEntity.from(groupAchievement.group);
    groupAchievementEntity.groupCategory = GroupCategoryEntity.from(
      groupAchievement.groupCategory,
    );
    groupAchievementEntity.content = groupAchievement.content;
    return groupAchievementEntity;
  }
}
