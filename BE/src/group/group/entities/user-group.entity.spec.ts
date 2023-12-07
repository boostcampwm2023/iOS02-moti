import { UsersFixture } from '../../../../test/user/users-fixture';
import { GroupFixture } from '../../../../test/group/group/group-fixture';
import { UserGroup } from '../domain/user-group.doamin';
import { UserGroupGrade } from '../domain/user-group-grade';
import { UserGroupEntity } from './user-group.entity';
import { UserEntity } from '../../../users/entities/user.entity';
import { GroupEntity } from './group.entity';

describe('UserGroupEntity Test', () => {
  describe('from으로 UserGroup에 대한 UserGroupEntity를 만들 수 있다.', () => {
    it('user와 group을 모두 가지고 있는 경우에 변환이 가능하다.', () => {
      // given
      const user = UsersFixture.user('ABC');
      user.id = 1;
      const group = GroupFixture.group();
      group.id = 2;
      const userGroup = new UserGroup(user, group, UserGroupGrade.PARTICIPANT);

      // when
      const userGroupEntity = UserGroupEntity.from(userGroup);

      // then
      expect(userGroupEntity).toBeInstanceOf(UserGroupEntity);
      expect(userGroupEntity.user).toEqual(UserEntity.from(user));
      expect(userGroupEntity.group).toEqual(GroupEntity.from(group));
      expect(userGroupEntity.grade).toBe(userGroup.grade);
    });

    it('user와 group이 없는 경우에도 변환이 가능하다.', () => {
      // given
      const userGroup = new UserGroup(null, null, UserGroupGrade.PARTICIPANT);

      // when
      const userGroupEntity = UserGroupEntity.from(userGroup);

      // then
      expect(userGroupEntity).toBeInstanceOf(UserGroupEntity);
      expect(userGroupEntity.user).toBeNull();
      expect(userGroupEntity.group).toBeNull();
      expect(userGroupEntity.grade).toBe(userGroup.grade);
    });
  });

  describe('toModel으로 UserGroupEntity를 UserGroup 도메인 객체로 변환할 수 있다.', () => {
    it('user와 group을 모두 가지고 있는 경우에 변환이 가능하다.', () => {
      // given
      const user = UserEntity.from(UsersFixture.user('ABC'));
      const group = GroupEntity.from(GroupFixture.group());

      const userGroupEntity = new UserGroupEntity();
      userGroupEntity.user = user;
      userGroupEntity.group = group;
      userGroupEntity.grade = UserGroupGrade.PARTICIPANT;

      // when
      const userGroup = userGroupEntity.toModel();

      // then
      expect(userGroup).toBeInstanceOf(UserGroup);
      expect(userGroup.user).toEqual(user.toModel());
      expect(userGroup.group).toEqual(group.toModel());
      expect(userGroup.grade).toBe(userGroupEntity.grade);
    });

    it('user와 group이 없는 경우에도 변환이 가능하다.', () => {
      // given
      const userGroupEntity = new UserGroupEntity();
      userGroupEntity.grade = UserGroupGrade.PARTICIPANT;

      // when
      const userGroup = userGroupEntity.toModel();

      // then
      expect(userGroup).toBeInstanceOf(UserGroup);
      expect(userGroup.user).toBeNull();
      expect(userGroup.group).toBeNull();
      expect(userGroup.grade).toBe(userGroupEntity.grade);
    });
  });
});
