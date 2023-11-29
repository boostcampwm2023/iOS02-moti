import { BaseTimeEntity } from '../../common/entities/base.entity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';
import { CategoryEntity } from '../../category/entities/category.entity';
import { Achievement } from '../domain/achievement.domain';
import { ImageEntity } from '../../image/entities/image.entity';
import { isNullOrUndefined } from '../../common/utils/is-null-or-undefined';

@Index(['deletedAt', 'id'])
@Entity({ name: 'achievement' })
export class AchievementEntity extends BaseTimeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ManyToOne(() => CategoryEntity)
  @JoinColumn({ name: 'category_id' })
  category: CategoryEntity;

  @Column({ type: 'varchar', length: 20 })
  title: string;

  @Column({ type: 'text' })
  content: string;

  @OneToOne(() => ImageEntity, (image) => image.achievement, {
    eager: true,
  })
  image: ImageEntity;

  toModel() {
    const achievement = new Achievement(
      this.user?.toModel(),
      this.category?.toModel() || null,
      this.title,
      this.content,
      this.image?.toModel() || null,
    );
    achievement.id = this.id;
    return achievement;
  }

  static from(achievement: Achievement) {
    if (isNullOrUndefined(achievement)) return achievement;

    const achievementEntity = new AchievementEntity();
    achievementEntity.id = achievement.id;
    achievementEntity.user = UserEntity.from(achievement.user);

    achievementEntity.category = CategoryEntity.from(achievement.category);
    achievementEntity.title = achievement.title;
    achievementEntity.content = achievement.content;
    achievementEntity.image = ImageEntity.strictFrom(achievement.image);
    return achievementEntity;
  }

  static strictFrom(achievement: Achievement) {
    if (isNullOrUndefined(achievement)) return achievement;

    const achievementEntity = new AchievementEntity();
    achievementEntity.id = achievement.id;
    achievementEntity.user = UserEntity.from(achievement.user);
    achievementEntity.category = CategoryEntity.from(achievement.category);
    achievementEntity.title = achievement.title;
    achievementEntity.content = achievement.content;
    return achievementEntity;
  }
}
