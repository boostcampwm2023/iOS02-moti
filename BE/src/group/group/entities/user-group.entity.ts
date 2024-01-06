import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from '../../../users/entities/user.entity';
import { GroupEntity } from './group.entity';
import { BaseTimeEntity } from '../../../common/entities/base.entity';
import { UserGroupGrade } from '../domain/user-group-grade';
import { UserGroup } from '../domain/user-group.doamin';
import { isNullOrUndefined } from '../../../common/utils/is-null-or-undefined';

@Entity({ name: 'user_group' })
export class UserGroupEntity extends BaseTimeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: UserEntity;

  @ManyToOne(() => GroupEntity)
  @JoinColumn({ name: 'group_id', referencedColumnName: 'id' })
  group: GroupEntity;

  @Column()
  seq: number;

  @Column({
    type: 'simple-enum',
    enum: UserGroupGrade,
    default: UserGroupGrade.PARTICIPANT,
  })
  grade: UserGroupGrade = UserGroupGrade.PARTICIPANT;

  toModel(): UserGroup {
    const usergroup = new UserGroup(
      this.user?.toModel(),
      this.group?.toModel(),
      this.grade,
      this.seq,
    );
    usergroup.id = this.id;
    return usergroup;
  }

  static from(userGroup: UserGroup): UserGroupEntity {
    if (isNullOrUndefined(userGroup)) return userGroup;
    const userGroupEntity = new UserGroupEntity();
    userGroupEntity.id = userGroup.id;
    userGroupEntity.user = UserEntity.from(userGroup.user);
    userGroupEntity.group = GroupEntity.strictFrom(userGroup.group);
    userGroupEntity.grade = userGroup.grade;
    userGroupEntity.seq = userGroup.seq;
    return userGroupEntity;
  }

  static strictFrom(userGroup: UserGroup): UserGroupEntity {
    const userGroupEntity = new UserGroupEntity();
    userGroupEntity.user = UserEntity.from(userGroup.user);
    userGroupEntity.grade = userGroup.grade;
    userGroupEntity.seq = userGroup.seq;
    return userGroupEntity;
  }
}
