import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseTimeEntity } from '../../../common/entities/base.entity';
import { Group } from '../domain/group.domain';

@Entity({ name: 'group' })
export class GroupEntity extends BaseTimeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  avatarUrl: string;

  toModel(): Group {
    const group = new Group(this.name, this.avatarUrl);
    group.id = this.id;

    return group;
  }

  static from(group: Group): GroupEntity {
    const groupEntity = new GroupEntity();
    groupEntity.id = group.id;
    groupEntity.name = group.name;
    groupEntity.avatarUrl = group.avatarUrl;
    return groupEntity;
  }
}
