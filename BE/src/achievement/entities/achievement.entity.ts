import { BaseTimeEntity } from '../../common/entities/base.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';
import { CategoryEntity } from '../../category/entities/category.entity';
import { Achievement } from '../domain/achievement.domain';

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

  @Column({ type: 'varchar', length: 100 })
  imageUrl: string;

  @Column({ type: 'varchar', length: 100 })
  thumbnailUrl: string;

  toModel() {
    const achievement = new Achievement(
      this.user?.toModel(),
      this.category?.toModel(),
      this.title,
      this.content,
      this.imageUrl,
      this.thumbnailUrl,
    );
    achievement.id = this.id;
    return achievement;
  }

  static from(achievement: Achievement) {
    const achievementEntity = new AchievementEntity();
    achievementEntity.id = achievement.id;
    achievementEntity.user = UserEntity.from(achievement?.user);
    achievementEntity.category = CategoryEntity.from(achievement?.category);
    achievementEntity.title = achievement.title;
    achievementEntity.content = achievement.content;
    achievementEntity.imageUrl = achievement.imageUrl;
    achievementEntity.thumbnailUrl = achievement.thumbnailUrl;
    return achievementEntity;
  }
}
