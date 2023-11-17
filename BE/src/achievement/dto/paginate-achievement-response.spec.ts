import { PaginateAchievementResponse } from './paginate-achievement-response';
import { AchievementResponse } from './achievement-response';
import { PaginateAchievementRequest } from './paginate-achievement-request';

describe('PaginateAchievementResponse test', () => {
  const achievementResponses: AchievementResponse[] = [];

  for (let i = 99; i >= 0; i--) {
    achievementResponses.push(
      new AchievementResponse(i, `thumbnail${i}`, `title${i}`),
    );
  }

  test('next url을 생성한다.', () => {
    const paginateAchievementRequest = new PaginateAchievementRequest();
    paginateAchievementRequest.take = 12;
    const response = new PaginateAchievementResponse(
      paginateAchievementRequest,
      achievementResponses.slice(0, paginateAchievementRequest.take),
    );
    expect(response.next).toEqual(
      '/api/v1/achievements?&take=12&where__id__less_than=88',
    );
  });
  test('next url을 생성한다. - categoryId 필터링 추가', () => {
    const paginateAchievementRequest = new PaginateAchievementRequest();
    paginateAchievementRequest.take = 12;
    paginateAchievementRequest.categoryId = 1;
    const response = new PaginateAchievementResponse(
      paginateAchievementRequest,
      achievementResponses.slice(0, paginateAchievementRequest.take),
    );
    expect(response.next).toEqual(
      '/api/v1/achievements?&take=12&categoryId=1&where__id__less_than=88',
    );
  });
});
