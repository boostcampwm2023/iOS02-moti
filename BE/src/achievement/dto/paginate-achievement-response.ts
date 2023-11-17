import { AchievementResponse } from './achievement-response';
import { PaginateAchievementRequest } from './paginate-achievement-request';

export class PaginateAchievementResponse {
  private basePath = '/api/v1/achievements?';
  data: AchievementResponse[];
  cursor: {
    after: number;
  };
  count: number;
  next: string;

  constructor(
    paginateAchievementRequest: PaginateAchievementRequest,
    achievements: AchievementResponse[],
  ) {
    this.data = achievements;

    const last =
      achievements.length > 0 &&
      achievements.length === paginateAchievementRequest.take
        ? achievements[achievements.length - 1]
        : null;

    this.cursor = {
      after: last?.id ?? null,
    };

    this.count = achievements.length;
    this.next = this.makeNextUrl(paginateAchievementRequest, last);
  }

  private makeNextUrl(
    paginateAchievementRequest: PaginateAchievementRequest,
    last: AchievementResponse,
  ) {
    const nextUrl = last && [this.basePath];

    if (nextUrl) {
      for (const key of Object.keys(paginateAchievementRequest)) {
        if (!paginateAchievementRequest[key]) {
          continue;
        }
        if (key !== 'where__id__less_than') {
          nextUrl.push(`${key}=${paginateAchievementRequest[key]}`);
        }
      }
      nextUrl.push(`where__id__less_than=${last.id.toString()}`);
    }

    return nextUrl?.join('&').toString() ?? null;
  }
}
