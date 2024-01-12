import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BaseTimeEntity } from '../../../common/entities/base.entity';
import { Group } from '../domain/group.domain';
import { UserGroupEntity } from './user-group.entity';
import { GroupAchievementEntity } from '../../achievement/entities/group-achievement.entity';
import { isNullOrUndefined } from '../../../common/utils/is-null-or-undefined';

@Entity({ name: 'group' })
export class GroupEntity extends BaseTimeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  avatarUrl: string;

  @Column({ type: 'varchar', length: 7, nullable: true })
  groupCode: string;

  @OneToMany(() => UserGroupEntity, (userGroup) => userGroup.group, {
    cascade: true,
  })
  userGroups: UserGroupEntity[];

  @Column()
  categoryCount: number;

  @Column()
  categorySequence: number;

  @OneToMany(
    () => GroupAchievementEntity,
    (groupAchievement) => groupAchievement.group,
    { cascade: true },
  )
  achievements: GroupAchievementEntity[];

  toModel(): Group {
    const group = new Group(
      this.name,
      this.avatarUrl,
      this.categoryCount,
      this.categorySequence,
    );
    group.id = this.id;
    group.groupCode = this.groupCode;
    group.userGroups = this.userGroups
      ? this.userGroups.map((ug) => ug.toModel())
      : [];
    return group;
  }

  static from(group: Group): GroupEntity {
    if (isNullOrUndefined(group)) return group;
    const groupEntity = new GroupEntity();
    groupEntity.id = group.id;
    groupEntity.name = group.name;
    groupEntity.groupCode = group.groupCode;
    groupEntity.userGroups = group.userGroups.length
      ? group.userGroups.map((ug) => UserGroupEntity.strictFrom(ug))
      : undefined;
    groupEntity.avatarUrl = group.avatarUrl;
    groupEntity.categorySequence = group.categorySequence;
    groupEntity.categoryCount = group.categoryCount;
    return groupEntity;
  }

  static strictFrom(group: Group): GroupEntity {
    if (isNullOrUndefined(group)) return group;
    const groupEntity = new GroupEntity();
    groupEntity.id = group.id;
    groupEntity.name = group.name;
    groupEntity.groupCode = group.groupCode;
    groupEntity.avatarUrl = group.avatarUrl;
    groupEntity.categorySequence = group.categorySequence;
    groupEntity.categoryCount = group.categoryCount;
    return groupEntity;
  }
}
