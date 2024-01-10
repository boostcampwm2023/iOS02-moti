import { GroupCategory } from '../domain/group.category';
import { UsersFixture } from '../../../../test/user/users-fixture';
import { User } from '../../../users/domain/user.domain';
import { GroupFixture } from '../../../../test/group/group/group-fixture';
import { Group } from '../../group/domain/group.domain';
import { GroupCategoryEntity } from './group-category.entity';
import { GroupEntity } from '../../group/entities/group.entity';
import { UserEntity } from '../../../users/entities/user.entity';
import { GroupCategoryFixture } from '../../../../test/group/category/group-category-fixture';

describe('GroupCategoryEntity Test', () => {
  describe('from으로 GroupCategory에 대한 GrupCategoryEntity를 만들 수 있다.', () => {
    it('user와 group을 모두 가지고 있는 경우에 변환이 가능하다.', () => {
      // given
      const user: User = UsersFixture.user('ABC');
      const group: Group = GroupFixture.group();
      const groupCategory: GroupCategory = GroupCategoryFixture.groupCategory(
        user,
        group,
      );

      // when
      const groupCategoryEntity = GroupCategoryEntity.from(groupCategory);

      // then
      expect(groupCategoryEntity).toBeInstanceOf(GroupCategoryEntity);
      expect(groupCategoryEntity.id).toBe(groupCategory.id);
      expect(groupCategoryEntity.user).toEqual(UserEntity.from(user));
      expect(groupCategoryEntity.group).toEqual(GroupEntity.from(group));
      expect(groupCategoryEntity.name).toBe(groupCategory.name);
    });

    it('user와 group이 없는 경우에도 변환이 가능하다.', () => {
      // given
      const groupCategory = new GroupCategory(null, null, '#1',0);

      // when
      const groupCategoryEntity = GroupCategoryEntity.from(groupCategory);

      // then
      expect(groupCategoryEntity).toBeInstanceOf(GroupCategoryEntity);
      expect(groupCategoryEntity.id).toBe(groupCategory.id);
      expect(groupCategoryEntity.user).toBeNull();
      expect(groupCategoryEntity.group).toBeNull();
      expect(groupCategoryEntity.name).toBe(groupCategory.name);
    });
  });

  describe('toModel으로 GroupCategoryEntity를 GroupCategory 도메인 객체로 변환할 수 있다.', () => {
    it('user와 group을 모두 가지고 있는 경우에 변환이 가능하다.', () => {
      // given
      const user: UserEntity = UserEntity.from(UsersFixture.user('ABC'));
      const group: GroupEntity = GroupEntity.from(GroupFixture.group());

      const groupCategoryEntity = new GroupCategoryEntity();
      groupCategoryEntity.id = 1;
      groupCategoryEntity.user = user;
      groupCategoryEntity.group = group;
      groupCategoryEntity.name = '#1';

      // when
      const result = groupCategoryEntity.toModel();

      // then
      expect(result).toBeInstanceOf(GroupCategory);
      expect(result.id).toBe(groupCategoryEntity.id);

      expect(result.user).toEqual(user.toModel());
      expect(result.group).toEqual(group.toModel());
      expect(result.name).toBe(groupCategoryEntity.name);
    });

    it('user와 group이 없는 경우에도 변환이 가능하다.', () => {
      // given
      const groupCategoryEntity = new GroupCategoryEntity();
      groupCategoryEntity.id = 1;
      groupCategoryEntity.name = '#1';

      // when
      const result = groupCategoryEntity.toModel();

      // then
      expect(result).toBeInstanceOf(GroupCategory);
      expect(result.id).toBe(groupCategoryEntity.id);
      expect(result.user).toBeUndefined();
      expect(result.group).toBeUndefined();
      expect(result.name).toBe(groupCategoryEntity.name);
    });
  });
});
