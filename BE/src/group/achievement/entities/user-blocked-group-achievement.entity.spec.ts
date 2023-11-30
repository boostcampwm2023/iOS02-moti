import { UsersFixture } from '../../../../test/user/users-fixture';
import { GroupAchievementFixture } from '../../../../test/group/achievement/group-achievement-fixture';
import { GroupFixture } from '../../../../test/group/group/group-fixture';
import { GroupCategoryFixture } from '../../../../test/group/category/group-category-fixture';
import { UserBlockedGroupAchievement } from '../domain/user-blocked-group-achievement.domain';
import { UserBlockedGroupAchievementEntity } from './user-blocked-group-achievement.entity';
import { UserEntity } from '../../../users/entities/user.entity';
import { GroupAchievementEntity } from './group-achievement.entity';

describe('UserBlockedGroupAchievementEntity Test', () => {
  describe('from으로 UserBlockedGroupAchievement에 대한 UserBlockedGroupAchievementEntity를 만들 수 있다.', () => {
    it('user와 groupAchievement을 모두 가지고 있는 경우에 변환이 가능하다.', () => {
      // given
      const user = UsersFixture.user('ABC');
      const group = GroupFixture.group();
      const groupCategory = GroupCategoryFixture.groupCategory(user, group);
      const groupAchievement = GroupAchievementFixture.groupAchievement(
        user,
        group,
        groupCategory,
      );

      const userBlockedGroupAchievement = new UserBlockedGroupAchievement(
        user,
        groupAchievement,
      );

      // when
      const userBlockedGroupAchievementEntity =
        UserBlockedGroupAchievementEntity.from(userBlockedGroupAchievement);

      // then
      expect(userBlockedGroupAchievementEntity).toBeInstanceOf(
        UserBlockedGroupAchievementEntity,
      );
      expect(userBlockedGroupAchievementEntity.user).toEqual(
        UserEntity.from(user),
      );
      expect(userBlockedGroupAchievementEntity.groupAchievement).toEqual(
        GroupAchievementEntity.from(groupAchievement),
      );
    });

    it('user와 groupAchievement이 없는 경우에도 변환이 가능하다.', () => {
      // given
      const userBlockedGroupAchievement = new UserBlockedGroupAchievement(
        null,
        null,
      );

      // when
      const userBlockedGroupAchievementEntity =
        UserBlockedGroupAchievementEntity.from(userBlockedGroupAchievement);

      // then
      expect(userBlockedGroupAchievementEntity).toBeInstanceOf(
        UserBlockedGroupAchievementEntity,
      );
      expect(userBlockedGroupAchievementEntity.user).toBeNull();
      expect(userBlockedGroupAchievementEntity.groupAchievement).toBeNull();
    });
  });

  describe('toModel으로 UserBlockedGroupAchievementEntity를 UserBlockedGroupAchievement 도메인 객체로 변환할 수 있다.', () => {
    it('user와 groupAchievement을 모두 가지고 있는 경우에 변환이 가능하다.', () => {
      // given
      const user = UsersFixture.user('ABC');
      const group = GroupFixture.group();
      const userEntity = UserEntity.from(user);
      const groupCategory = GroupCategoryFixture.groupCategory(user, group);
      const groupAchievement = GroupAchievementEntity.from(
        GroupAchievementFixture.groupAchievement(user, group, groupCategory),
      );

      const userBlockedGroupAchievementEntity =
        new UserBlockedGroupAchievementEntity();
      userBlockedGroupAchievementEntity.user = userEntity;
      userBlockedGroupAchievementEntity.groupAchievement = groupAchievement;

      // when
      const userBlockedGroupAchievement =
        userBlockedGroupAchievementEntity.toModel();

      // then
      expect(userBlockedGroupAchievement).toBeInstanceOf(
        UserBlockedGroupAchievement,
      );
      expect(userBlockedGroupAchievement.user).toEqual(userEntity.toModel());
      expect(userBlockedGroupAchievement.groupAchievement).toEqual(
        groupAchievement.toModel(),
      );
    });

    it('user와 groupAchievement이 없는 경우에도 변환이 가능하다.', () => {
      // given
      const userBlockedGroupAchievementEntity =
        new UserBlockedGroupAchievementEntity();

      // when
      const userBlockedGroupAchievement =
        userBlockedGroupAchievementEntity.toModel();

      // then
      expect(userBlockedGroupAchievement).toBeInstanceOf(
        UserBlockedGroupAchievement,
      );
      expect(userBlockedGroupAchievement.user).toBeUndefined();
      expect(userBlockedGroupAchievement.groupAchievement).toBeUndefined();
    });
  });
});
