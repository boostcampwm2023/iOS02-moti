import { UsersFixture } from '../../../test/user/users-fixture';
import { CategoryFixture } from '../../../test/category/category-fixture';
import { AchievementFixture } from '../../../test/achievement/achievement-fixture';
import { AchievementEntity } from './achievement.entity';
import { UserEntity } from '../../users/entities/user.entity';
import { CategoryEntity } from '../../category/entities/category.entity';
import { ImageEntity } from '../../image/entities/image.entity';
import { ImageFixture } from '../../../test/image/image-fixture';
import { Achievement } from '../domain/achievement.domain';

describe('AchievementEntity Test', () => {
  it('from으로 Achievement에 대한 AchievementEntity를 만들 수 있다.', () => {
    // given
    const user = UsersFixture.user('ABC');
    const cateogry = CategoryFixture.category(user, 'category');
    const image = ImageFixture.image(user);
    const achievement = AchievementFixture.achievement(user, cateogry, image);

    // when
    const achievementEntity = AchievementEntity.from(achievement);

    // then
    expect(achievementEntity).toBeInstanceOf(AchievementEntity);
    expect(achievementEntity.id).toBe(achievement.id);
    expect(achievementEntity.user).toEqual(UserEntity.from(user));
    expect(achievementEntity.category).toEqual(CategoryEntity.from(cateogry));
    expect(achievementEntity.title).toBe(achievement.title);
    expect(achievementEntity.content).toBe(achievement.content);
    expect(achievementEntity.image).toEqual(ImageEntity.from(image));
  });

  it('from으로 Achievement에 대한 AchievementEntity를 만들 수 있다. (image가 없는 경우)', () => {
    // given
    const achievement = AchievementFixture.achievement(null, null, null);

    // when
    const achievementEntity = AchievementEntity.from(achievement);

    // then
    expect(achievementEntity).toBeInstanceOf(AchievementEntity);
    expect(achievementEntity.id).toBe(achievement.id);
    expect(achievementEntity.user).toBeNull();
    expect(achievementEntity.category).toBeNull();
    expect(achievementEntity.title).toBe(achievement.title);
    expect(achievementEntity.content).toBe(achievement.content);
  });

  it('strictFrom은 image가 undefined 이어야 한다.', () => {
    // given
    const user = UsersFixture.user('ABC');
    const cateogry = CategoryFixture.category(user, 'category');
    const image = ImageFixture.image(user);
    const achievement = AchievementFixture.achievement(user, cateogry, image);

    // when
    const achievementEntity = AchievementEntity.strictFrom(achievement);

    // then
    expect(achievementEntity).toBeInstanceOf(AchievementEntity);
    expect(achievementEntity.id).toBe(achievement.id);
    expect(achievementEntity.user).toEqual(UserEntity.from(user));
    expect(achievementEntity.category).toEqual(CategoryEntity.from(cateogry));
    expect(achievementEntity.title).toBe(achievement.title);
    expect(achievementEntity.content).toBe(achievement.content);
    expect(achievementEntity.image).toBeNull();
  });

  it('toModel은 Achievement를 만들어낸다.', () => {
    // given
    const user = UsersFixture.user('ABC');
    const userEntity = UserEntity.from(user);
    const cateogry = CategoryFixture.category(user, 'category');
    const categoryEntity = CategoryEntity.from(cateogry);
    const image = ImageFixture.image(user);
    const imageEntity = ImageEntity.from(image);
    const achievement = AchievementEntity.from(
      AchievementFixture.achievement(user, cateogry, image),
    );

    // when
    const achievementModel = achievement.toModel();

    // then
    expect(achievementModel).toBeInstanceOf(Achievement);
    expect(achievementModel.id).toBe(achievement.id);
    expect(achievementModel.user).toEqual(userEntity.toModel());
    expect(achievementModel.category).toEqual(categoryEntity.toModel());
    expect(achievementModel.title).toBe(achievement.title);
    expect(achievementModel.content).toBe(achievement.content);
    expect(achievementModel.image).toEqual(imageEntity.toModel());
  });
});
