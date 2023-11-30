import { Group } from '../../../src/group/group/domain/group.domain';
import { GroupRepository } from '../../../src/group/group/entities/group.repository';
import { User } from '../../../src/users/domain/user.domain';
import { UserGroupGrade } from '../../../src/group/group/domain/user-group-grade';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GroupFixture {
  static id: number = 0;

  constructor(private readonly groupRepository: GroupRepository) {}

  async createGroup(name: string, user?: User) {
    const group = GroupFixture.group(name);
    if (user) {
      group.addMember(user, UserGroupGrade.LEADER);
    }
    return await this.groupRepository.saveGroup(group);
  }

  async addMember(group: Group, user: User, userGroupGrade: UserGroupGrade) {
    group.addMember(user, userGroupGrade);
    return await this.groupRepository.saveGroup(group);
  }

  async getGroup(user: User) {
    const group = GroupFixture.group();
    group.addMember(user, UserGroupGrade.LEADER);
    console.log(this.groupRepository);
    return this.groupRepository.saveGroup(group);
  }

  static group(name?: string) {
    return new Group(name || `group${++GroupFixture.id}`, 'file://avatarUrl');
  }
}
