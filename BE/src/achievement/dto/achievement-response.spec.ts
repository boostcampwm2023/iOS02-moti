import { ImageFixture } from '../../../test/image/image-fixture';
import { Achievement } from '../domain/achievement.domain';
import { AchievementResponse } from './achievement-response';
import { Image } from '../../image/domain/image.domain';

describe('AchievementResponse Test', () => {
  it('from으로 Achievement를 AchievementResponse로 만들 수 있다.', () => {
    const image = ImageFixture.image(null, 'imageUrl', 'thumbnailUrl');
    const achievement = new Achievement(null, null, 'title', 'content', image);

    const achievementResponse = AchievementResponse.from(achievement);

    expect(achievementResponse).toBeInstanceOf(AchievementResponse);
    expect(achievementResponse.id).toEqual(achievement.id);
    expect(achievementResponse.thumbnailUrl).toEqual(
      achievement.image.thumbnailUrl,
    );
  });

  it('from으로 Achievement를 AchievementResponse로 만들 수 있다.', () => {
    const image = ImageFixture.image(null, 'imageUrl', null);
    const achievement = new Achievement(null, null, 'title', 'content', image);

    const achievementResponse = AchievementResponse.from(achievement);

    expect(achievementResponse).toBeInstanceOf(AchievementResponse);
    expect(achievementResponse.id).toEqual(achievement.id);
    expect(achievementResponse.thumbnailUrl).toEqual(
      achievement.image.imageUrl,
    );
  });

  it('from으로 Achievement를 AchievementResponse로 만들 수 있다.', () => {
    const image = new Image(null);
    const achievement = new Achievement(null, null, 'title', 'content', image);

    const achievementResponse = AchievementResponse.from(achievement);

    expect(achievementResponse).toBeInstanceOf(AchievementResponse);
    expect(achievementResponse.id).toEqual(achievement.id);
    expect(achievementResponse.thumbnailUrl).toBeNull();
  });
});
