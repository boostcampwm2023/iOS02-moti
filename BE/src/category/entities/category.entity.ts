import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseTimeEntity } from '../../common/entities/base.entity';
import { UserEntity } from '../../users/entities/user.entity';
import { Category } from '../domain/category.domain';
import { AchievementEntity } from '../../achievement/entities/achievement.entity';
import { isNullOrUndefined } from '../../common/utils/is-null-or-undefined';

@Entity({ name: 'category' })
@Index(['user'])
export class CategoryEntity extends BaseTimeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: UserEntity;

  @Column({ name: 'name' })
  name: string;

  @OneToMany(() => AchievementEntity, (achievement) => achievement.category)
  achievements: AchievementEntity[];

  toModel(): Category {
    const category = new Category(this.user?.toModel(), this.name);
    category.id = this.id;
    return category;
  }

  static from(category: Category): CategoryEntity {
    if (isNullOrUndefined(category)) return category;

    const categoryEntity = new CategoryEntity();
    categoryEntity.id = category.id;
    categoryEntity.user = UserEntity.from(category.user);
    categoryEntity.name = category.name;
    return categoryEntity;
  }
}
