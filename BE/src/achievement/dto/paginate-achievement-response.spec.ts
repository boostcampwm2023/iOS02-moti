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

  test('다음 페이지 네이션 요청을 위한 정보를 가지고 있는 next을 생성한다.', () => {
    const paginateAchievementRequest = new PaginateAchievementRequest();
    paginateAchievementRequest.take = 12;
    const response = new PaginateAchievementResponse(
      paginateAchievementRequest,
      achievementResponses.slice(0, paginateAchievementRequest.take),
    );
    expect(response.next).toEqual({ take: 12, whereIdLessThan: 88 });
  });
  test('다음 페이지 네이션 요청을 위한 정보를 가지고 있는 next을 생성한다. - categoryId 필터링 추가', () => {
    const paginateAchievementRequest = new PaginateAchievementRequest();
    paginateAchievementRequest.take = 12;
    paginateAchievementRequest.categoryId = 1;
    const response = new PaginateAchievementResponse(
      paginateAchievementRequest,
      achievementResponses.slice(0, paginateAchievementRequest.take),
    );
    expect(response.next).toEqual({
      categoryId: 1,
      take: 12,
      whereIdLessThan: 88,
    });
  });
});
