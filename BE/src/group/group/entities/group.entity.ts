import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BaseTimeEntity } from '../../../common/entities/base.entity';
import { Group } from '../domain/group.domain';
import { UserGroupEntity } from './user-group.entity';
import { GroupAchievementEntity } from '../../achievement/entities/group-achievement.entity';
import { isNullOrUndefined } from '../../../common/utils/is-null-undefinded';

@Entity({ name: 'group' })
export class GroupEntity extends BaseTimeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  avatarUrl: string;

  @OneToMany(() => UserGroupEntity, (userGroup) => userGroup.group, {
    cascade: true,
  })
  userGroups: UserGroupEntity[];

  toModel(): Group {
    const group = new Group(this.name, this.avatarUrl);
    group.id = this.id;
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
    groupEntity.userGroups = group.userGroups.length
      ? group.userGroups.map((ug) => UserGroupEntity.strictFrom(ug))
      : undefined;
    groupEntity.avatarUrl = group.avatarUrl;
    return groupEntity;
  }

  static strictFrom(group: Group): GroupEntity {
    if (isNullOrUndefined(group)) return group;
    const groupEntity = new GroupEntity();
    groupEntity.id = group.id;
    groupEntity.name = group.name;
    groupEntity.avatarUrl = group.avatarUrl;
    return groupEntity;
  }
}
