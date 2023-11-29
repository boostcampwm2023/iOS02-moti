import {
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from '../../../users/entities/user.entity';
import { GroupEntity } from './group.entity';
import { BaseTimeEntity } from '../../../common/entities/base.entity';
import { UserGroupGrade } from '../domain/user-group-grade';
import { UserGroup } from '../domain/user-group.doamin';

@Entity({ name: 'user_group' })
export class UserGroupEntity extends BaseTimeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: UserEntity;

  @ManyToOne(() => GroupEntity)
  @JoinColumn({ name: 'group_id', referencedColumnName: 'id' })
  group: GroupEntity;

  @PrimaryColumn({
    type: 'simple-enum',
    enum: UserGroupGrade,
    default: UserGroupGrade.PARTICIPANT,
  })
  grade: UserGroupGrade = UserGroupGrade.PARTICIPANT;

  toModel(): UserGroup {
    return new UserGroup(
      this.user?.toModel() || null,
      this.group?.toModel() || null,
      this.grade,
    );
  }

  static from(userGroup: UserGroup): UserGroupEntity {
    const userGroupEntity = new UserGroupEntity();
    userGroupEntity.user = userGroup.user
      ? UserEntity.from(userGroup.user)
      : null;
    userGroupEntity.group = userGroup.group
      ? GroupEntity.strictFrom(userGroup.group)
      : null;
    userGroupEntity.grade = userGroup.grade;
    return userGroupEntity;
  }

  static strictFrom(userGroup: UserGroup): UserGroupEntity {
    const userGroupEntity = new UserGroupEntity();
    userGroupEntity.user = userGroup.user
      ? UserEntity.from(userGroup.user)
      : null;
    userGroupEntity.grade = userGroup.grade;
    return userGroupEntity;
  }
}
