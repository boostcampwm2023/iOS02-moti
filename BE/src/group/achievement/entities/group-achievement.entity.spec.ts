import { UsersFixture } from '../../../../test/user/users-fixture';
import { GroupFixture } from '../../../../test/group/group/group-fixture';
import { GroupCategoryFixture } from '../../../../test/group/category/group-category-fixture';
import { GroupAchievementEntity } from './group-achievement.entity';
import { GroupAchievement } from '../domain/group-achievement.domain';
import { UserEntity } from '../../../users/entities/user.entity';
import { GroupEntity } from '../../group/entities/group.entity';
import { GroupCategoryEntity } from '../../category/entities/group-category.entity';

describe('GroupAchievementEntity Test', () => {
  describe('from으로 GroupAchievement에 대한 GroupAchievementEntity를 만들 수 있다.', () => {
    it('user와 group, groupCategory를 모두 가지고 있는 경우에 변환이 가능하다.', () => {
      // given
      const user = UsersFixture.user('ABC');
      const group = GroupFixture.group();
      const groupCategory = GroupCategoryFixture.groupCategory(user, group);
      const groupAchievement = new GroupAchievement(
        'title',
        user,
        group,
        groupCategory,
        'content',
      );

      // when
      const groupAchievementEntity =
        GroupAchievementEntity.from(groupAchievement);

      // then
      expect(groupAchievementEntity).toBeInstanceOf(GroupAchievementEntity);
      expect(groupAchievementEntity.id).toBe(groupAchievement.id);
      expect(groupAchievementEntity.user).toEqual(UserEntity.from(user));
      expect(groupAchievementEntity.group).toEqual(GroupEntity.from(group));
      expect(groupAchievementEntity.groupCategory).toEqual(
        GroupCategoryEntity.from(groupCategory),
      );
      expect(groupAchievementEntity.content).toBe(groupAchievement.content);
    });

    it('user와 group, groupCategory가 없는 경우에도 변환이 가능하다.', () => {
      // given
      const groupAchievement = new GroupAchievement(
        'title',
        null,
        null,
        null,
        'content',
      );

      // when
      const groupAchievementEntity =
        GroupAchievementEntity.from(groupAchievement);

      // then
      expect(groupAchievementEntity).toBeInstanceOf(GroupAchievementEntity);
      expect(groupAchievementEntity.id).toBe(groupAchievement.id);
      expect(groupAchievementEntity.user).toBeNull();
      expect(groupAchievementEntity.group).toBeNull();
      expect(groupAchievementEntity.groupCategory).toBeNull();
      expect(groupAchievementEntity.content).toBe(groupAchievement.content);
    });
  });

  describe('toModel으로 GroupAchievementEntity를 GroupAchievement 도메인 객체로 변환할 수 있다.', () => {
    it('user와 group, groupCategory를 모두 가지고 있는 경우에 변환이 가능하다.', () => {
      // given
      const user = UsersFixture.user('ABC');
      const group = GroupFixture.group();
      const userEntity = UserEntity.from(user);
      const groupEntity = GroupEntity.from(group);
      const groupCategory = GroupCategoryEntity.from(
        GroupCategoryFixture.groupCategory(user, group),
      );

      const groupAchievementEntity = new GroupAchievementEntity();
      groupAchievementEntity.id = 1;
      groupAchievementEntity.user = userEntity;
      groupAchievementEntity.group = groupEntity;
      groupAchievementEntity.groupCategory = groupCategory;
      groupAchievementEntity.content = 'content';

      // when
      const result = groupAchievementEntity.toModel();

      // then
      expect(result).toBeInstanceOf(GroupAchievement);
      expect(result.id).toBe(groupAchievementEntity.id);
      expect(result.user).toEqual(userEntity.toModel());
      expect(result.group).toEqual(groupEntity.toModel());
      expect(result.groupCategory).toEqual(groupCategory.toModel());
      expect(result.content).toBe(groupAchievementEntity.content);
    });

    it('user와 group, groupCategory가 없는 경우에도 변환이 가능하다.', () => {
      // given
      const groupAchievementEntity = new GroupAchievementEntity();
      groupAchievementEntity.id = 1;
      groupAchievementEntity.content = 'content';

      // when
      const result = groupAchievementEntity.toModel();

      // then
      expect(result).toBeInstanceOf(GroupAchievement);
      expect(result.id).toBe(groupAchievementEntity.id);
      expect(result.user).toBeUndefined();
      expect(result.group).toBeUndefined();
      expect(result.groupCategory).toBeUndefined();
      expect(result.content).toBe(groupAchievementEntity.content);
    });
  });
});
