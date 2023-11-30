import { BaseTimeEntity } from '../../../common/entities/base.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from '../../../users/entities/user.entity';
import { GroupAchievementImage } from '../domain/group-achievement-image.domain';
import { GroupAchievementEntity } from '../../achievement/entities/group-achievement.entity';
import { isNullOrUndefined } from '../../../common/utils/is-null-or-undefined';

@Entity({ name: 'group_achievement_image' })
export class GroupAchievementImageEntity extends BaseTimeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: UserEntity;

  @Column({ type: 'varchar', length: 255, nullable: false })
  originalName: string;

  @Column({ type: 'varchar', length: 200, nullable: false })
  imageUrl: string;

  @Column({ type: 'varchar', length: 200, nullable: false })
  thumbnailUrl: string;

  @ManyToOne(() => GroupAchievementEntity)
  @JoinColumn({ name: 'group_achievement_id', referencedColumnName: 'id' })
  groupAchievement: GroupAchievementEntity;

  static from(image: GroupAchievementImage): GroupAchievementImageEntity {
    if (isNullOrUndefined(image)) return image;

    const imageEntity = new GroupAchievementImageEntity();
    imageEntity.id = image.id;
    imageEntity.originalName = image.originalName;
    imageEntity.imageUrl = image.imageUrl;
    imageEntity.thumbnailUrl = image.thumbnailUrl;
    imageEntity.groupAchievement = GroupAchievementEntity.from(
      image.groupAchievement,
    );
    imageEntity.user = UserEntity.from(image.user);
    return imageEntity;
  }

  toModel(): GroupAchievementImage {
    const image = new GroupAchievementImage(this.user?.toModel());
    image.originalName = this.originalName;
    image.imageUrl = this.imageUrl;
    image.id = this.id;
    image.groupAchievement = this.groupAchievement?.toModel();
    image.user = this.user?.toModel();
    image.thumbnailUrl = this.thumbnailUrl;
    return image;
  }
}
