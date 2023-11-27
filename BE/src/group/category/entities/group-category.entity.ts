import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from '../../../users/entities/user.entity';
import { BaseTimeEntity } from '../../../common/entities/base.entity';
import { GroupEntity } from '../../group/entities/group.entity';
import { GroupCategory } from '../domain/group.category';

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

  toModel(): GroupCategory {
    const group = new GroupCategory(
      this.user?.toModel() || null,
      this.group?.toModel() || null,
      this.name,
    );
    group.id = this.id;

    return group;
  }

  static from(groupCategory: GroupCategory): GroupCategoryEntity {
    const groupCategoryEntity = new GroupCategoryEntity();
    groupCategoryEntity.id = groupCategory.id;
    groupCategoryEntity.user = groupCategory.user
      ? UserEntity.from(groupCategory?.user)
      : null;
    groupCategoryEntity.group = groupCategory.group
      ? GroupEntity.from(groupCategory?.group)
      : null;
    groupCategoryEntity.name = groupCategory.name;
    return groupCategoryEntity;
  }
}
