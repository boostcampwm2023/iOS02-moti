import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from '../../../users/entities/user.entity';
import { BaseTimeEntity } from '../../../common/entities/base.entity';
import { GroupEntity } from '../../group/entities/group.entity';
import { GroupCategory } from '../domain/group.category';
import { isNullOrUndefined } from '../../../common/utils/is-null-or-undefined';
import { GroupAchievementEntity } from '../../achievement/entities/group-achievement.entity';

@Entity('group_category')
export class GroupCategoryEntity extends BaseTimeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: UserEntity;

  @ManyToOne(() => GroupEntity)
  @JoinColumn({ name: 'group_id', referencedColumnName: 'id' })
  group: GroupEntity;

  @Column({ name: 'name' })
  name: string;

  @OneToMany(
    () => GroupAchievementEntity,
    (achievements) => achievements.groupCategory,
  )
  achievements: GroupAchievementEntity[];

  toModel(): GroupCategory {
    const group = new GroupCategory(
      this.user?.toModel(),
      this.group?.toModel(),
      this.name,
    );
    group.id = this.id;

    return group;
  }

  static from(groupCategory: GroupCategory): GroupCategoryEntity {
    if (isNullOrUndefined(groupCategory)) return groupCategory;

    const groupCategoryEntity = new GroupCategoryEntity();
    groupCategoryEntity.id = groupCategory.id;
    groupCategoryEntity.user = UserEntity.from(groupCategory?.user);
    groupCategoryEntity.group = GroupEntity.from(groupCategory?.group);
    groupCategoryEntity.name = groupCategory.name;
    return groupCategoryEntity;
  }
}
