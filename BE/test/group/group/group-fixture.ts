import { Group } from '../../../src/group/group/domain/group.domain';
import { GroupRepository } from '../../../src/group/group/entities/group.repository';
import { User } from '../../../src/users/domain/user.domain';
import { UserGroupGrade } from '../../../src/group/group/domain/user-group-grade';
import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../../src/users/entities/user.repository';

@Injectable()
export class GroupFixture {
  static id: number = 0;

  constructor(
    private readonly groupRepository: GroupRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async createGroup(name: string, user?: User) {
    const group = GroupFixture.group(name);
    if (user) {
      group.addMember(user, UserGroupGrade.LEADER);
    }
    await this.userRepository.updateUser(user);
    return await this.groupRepository.saveGroup(group);
  }

  async addMember(group: Group, user: User, userGroupGrade: UserGroupGrade) {
    group.addMember(user, userGroupGrade);
    await this.userRepository.updateUser(user);
    return await this.groupRepository.saveGroup(group);
  }

  async createGroups(user: User, members?: User[], managers?: User[]) {
    const group = GroupFixture.group();
    group.addMember(user, UserGroupGrade.LEADER);
    for (const member of members || []) {
      group.addMember(member, UserGroupGrade.PARTICIPANT);
      await this.userRepository.updateUser(member);
    }
    for (const manager of managers || []) {
      group.addMember(manager, UserGroupGrade.MANAGER);
      await this.userRepository.updateUser(manager);
    }
    return this.groupRepository.saveGroup(group);
  }

  static group(name?: string) {
    const group = new Group(
      name || `group${++GroupFixture.id}`,
      'file://avatarUrl',
    );
    group.assignGroupCode(`GABCDE${++GroupFixture.id}`);
    return new Group(name || `group${++GroupFixture.id}`, 'file://avatarUrl');
  }
}
