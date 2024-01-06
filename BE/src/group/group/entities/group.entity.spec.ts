import { UserGroupEntity } from './user-group.entity';
import { GroupEntity } from './group.entity';
import { Group } from '../domain/group.domain';
import { UserGroup } from '../domain/user-group.doamin';
import { UserGroupGrade } from '../domain/user-group-grade';
import { UsersFixture } from '../../../../test/user/users-fixture';

describe('GroupEntity Test', () => {
  describe('from으로 Group 대한 GroupEntity를 만들 수 있다.', () => {
    it('userGroups를 가지고 있지 않은 경우에 변환이 가능하다.', () => {
      // given
      const group = new Group('group', 'avatarUrl');
      group.assignGroupCode('ABCDEF1');

      // when
      const groupEntity = GroupEntity.from(group);

      // then
      expect(groupEntity).toBeInstanceOf(GroupEntity);
      expect(groupEntity.name).toEqual('group');
      expect(groupEntity.avatarUrl).toEqual('avatarUrl');
      expect(groupEntity.groupCode).toEqual('ABCDEF1');
      expect(groupEntity.userGroups).toEqual(undefined);
    });

    it('userGroups를 가지고 있는 경우에 변환이 가능하다.', () => {
      // given
      const group = new Group('group', 'avatarUrl');
      const user = UsersFixture.user('ABC');

      group.userGroups = [];
      group.userGroups.push(
        new UserGroup(
          user,
          group,
          UserGroupGrade.PARTICIPANT,
          user.groupSequence,
        ),
      );

      // when
      const groupEntity = GroupEntity.from(group);

      // then
      expect(groupEntity).toBeInstanceOf(GroupEntity);
      expect(groupEntity.name).toEqual('group');
      expect(groupEntity.avatarUrl).toEqual('avatarUrl');
      expect(groupEntity.userGroups.length).toEqual(1);
    });
  });

  describe('toModel으로 GroupEntity를 Group 도메인 객체로 변환할 수 있다.', () => {
    it('userGroups를 가지고 있지 않은 경우에 변환이 가능하다.', () => {
      // given
      const group = new Group('group', 'avatarUrl');
      group.assignGroupCode('ABCDEF1');
      const groupEntity = GroupEntity.from(group);

      // when
      const domain = groupEntity.toModel();

      // then
      expect(domain).toBeInstanceOf(Group);
      expect(domain.name).toEqual('group');
      expect(domain.groupCode).toEqual('ABCDEF1');
      expect(domain.avatarUrl).toEqual('avatarUrl');
      expect(domain.userGroups.length).toEqual(0);
    });

    it('userGroups를 가지고 있는 경우에 변환이 가능하다.', () => {
      // given
      const group = new Group('group', 'avatarUrl');
      const user = UsersFixture.user('ABC');
      const userGroup = new UserGroup(
        user,
        group,
        UserGroupGrade.PARTICIPANT,
        user.groupSequence,
      );

      const groupEntity = GroupEntity.from(group);
      const userGroupEntity = UserGroupEntity.from(userGroup);
      groupEntity.userGroups = [userGroupEntity];

      // when
      const groupDomain = groupEntity.toModel();

      // then
      expect(groupDomain).toBeInstanceOf(Group);
      expect(groupDomain.name).toEqual('group');
      expect(groupDomain.avatarUrl).toEqual('avatarUrl');
      expect(groupDomain.userGroups.length).toEqual(1);
    });
  });
});
