import { UsersFixture } from '../../../../test/user/users-fixture';
import { GroupAchievementFixture } from '../../../../test/group/achievement/group-achievement-fixture';
import { GroupFixture } from '../../../../test/group/group/group-fixture';
import { GroupCategoryFixture } from '../../../../test/group/category/group-category-fixture';
import { GroupAchievementImage } from '../domain/group-achievement-image.domain';
import { GroupAchievementImageEntity } from './group-achievement-image.entity';
import { GroupAchievementEntity } from '../../achievement/entities/group-achievement.entity';
import { UserEntity } from '../../../users/entities/user.entity';

describe('GroupAhievementImageEntity Test', () => {
  describe('from은 생성자로 새로운 인스턴스를 만들어야 한다.', () => {
    it('생성자로 새로운 인스턴스를 만들어야 한다.', () => {
      // given
      const user = UsersFixture.user('ABC');
      const group = GroupFixture.group('ABC');
      const groupCategory = GroupCategoryFixture.groupCategory(
        user,
        group,
        'ABC',
      );
      const groupAchievement = GroupAchievementFixture.groupAchievement(
        user,
        group,
        groupCategory,
      );

      const groupAchievementImage = new GroupAchievementImage(user);
      groupAchievementImage.id = 1;
      groupAchievementImage.originalName = 'originalName';
      groupAchievementImage.imageUrl = 'imageUrl';
      groupAchievementImage.thumbnailUrl = 'thumbnailUrl';
      groupAchievementImage.groupAchievement = groupAchievement;

      // when
      const groupAchievementImageEntity = GroupAchievementImageEntity.from(
        groupAchievementImage,
      );

      // then
      expect(groupAchievementImageEntity).toBeInstanceOf(
        GroupAchievementImageEntity,
      );
      expect(groupAchievementImageEntity.id).toBe(groupAchievementImage.id);
      expect(groupAchievementImageEntity.originalName).toBe(
        groupAchievementImage.originalName,
      );
      expect(groupAchievementImageEntity.imageUrl).toBe(
        groupAchievementImage.imageUrl,
      );
      expect(groupAchievementImageEntity.thumbnailUrl).toBe(
        groupAchievementImage.thumbnailUrl,
      );
      expect(groupAchievementImageEntity.groupAchievement).toEqual(
        GroupAchievementEntity.from(groupAchievement),
      );
      expect(groupAchievementImageEntity.user).toEqual(UserEntity.from(user));
    });

    it('생성자로 새로운 인스턴스를 만들어야 한다. (groupAchievement이 없는 경우)', () => {
      // given
      const groupAchievementImage = new GroupAchievementImage(null);

      // when
      const groupAchievementImageEntity = GroupAchievementImageEntity.from(
        groupAchievementImage,
      );

      // then
      expect(groupAchievementImageEntity).toBeInstanceOf(
        GroupAchievementImageEntity,
      );
      expect(groupAchievementImageEntity.id).toBe(groupAchievementImage.id);
      expect(groupAchievementImageEntity.originalName).toBe(
        groupAchievementImage.originalName,
      );
      expect(groupAchievementImageEntity.imageUrl).toBe(
        groupAchievementImage.imageUrl,
      );
      expect(groupAchievementImageEntity.thumbnailUrl).toBe(
        groupAchievementImage.thumbnailUrl,
      );
      expect(groupAchievementImageEntity.groupAchievement).toBeNull();
      expect(groupAchievementImageEntity.user).toBeNull();
    });
  });

  describe('toModel은 인스턴스를 반환한다.', () => {
    it('user, group, groupCategory가 있을 때 변환할 수 있다.', () => {
      // given
      const user = UsersFixture.user('ABC');
      const userEntity = UserEntity.from(user);
      const group = GroupFixture.group('ABC');
      const groupCategory = GroupCategoryFixture.groupCategory(
        user,
        group,
        'ABC',
      );
      const groupAchievementEntity = GroupAchievementEntity.from(
        GroupAchievementFixture.groupAchievement(user, group, groupCategory),
      );

      const groupAchievementImageEntity = new GroupAchievementImageEntity();
      groupAchievementImageEntity.id = 1;
      groupAchievementImageEntity.originalName = 'originalName';
      groupAchievementImageEntity.imageUrl = 'imageUrl';
      groupAchievementImageEntity.thumbnailUrl = 'thumbnailUrl';
      groupAchievementImageEntity.groupAchievement = groupAchievementEntity;
      groupAchievementImageEntity.user = userEntity;

      // when
      const groupAchievementImage = groupAchievementImageEntity.toModel();

      // then
      expect(groupAchievementImage).toBeInstanceOf(GroupAchievementImage);
      expect(groupAchievementImage.id).toBe(groupAchievementImageEntity.id);
      expect(groupAchievementImage.originalName).toBe(
        groupAchievementImageEntity.originalName,
      );
      expect(groupAchievementImage.imageUrl).toBe(
        groupAchievementImageEntity.imageUrl,
      );
      expect(groupAchievementImage.thumbnailUrl).toBe(
        groupAchievementImageEntity.thumbnailUrl,
      );
      expect(groupAchievementImage.groupAchievement).toEqual(
        groupAchievementEntity.toModel(),
      );
      expect(groupAchievementImage.user).toEqual(userEntity.toModel());
    });

    it('user, group, groupCategory가 없을 때 변환할 수 있다.', () => {
      // given
      const groupAchievementImageEntity = new GroupAchievementImageEntity();
      groupAchievementImageEntity.id = 1;
      groupAchievementImageEntity.originalName = 'originalName';
      groupAchievementImageEntity.imageUrl = 'imageUrl';
      groupAchievementImageEntity.thumbnailUrl = 'thumbnailUrl';

      // when
      const groupAchievementImage = groupAchievementImageEntity.toModel();

      // then
      expect(groupAchievementImage).toBeInstanceOf(GroupAchievementImage);
      expect(groupAchievementImage.id).toBe(groupAchievementImageEntity.id);
      expect(groupAchievementImage.originalName).toBe(
        groupAchievementImageEntity.originalName,
      );
      expect(groupAchievementImage.imageUrl).toBe(
        groupAchievementImageEntity.imageUrl,
      );
      expect(groupAchievementImage.thumbnailUrl).toBe(
        groupAchievementImageEntity.thumbnailUrl,
      );
      expect(groupAchievementImage.groupAchievement).toBeNull();
    });
  });
});
