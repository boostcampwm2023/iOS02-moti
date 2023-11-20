import { AchievementResponse } from './achievement-response';
import { PaginateAchievementRequest } from './paginate-achievement-request';
import { Next } from '../index';

export class PaginateAchievementResponse {
  data: AchievementResponse[];
  count: number;
  next: Next | null;

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

    this.count = achievements.length;
    this.next = this.makeNext(paginateAchievementRequest, last);
  }

  private makeNext(
    paginateAchievementRequest: PaginateAchievementRequest,
    last: AchievementResponse,
  ) {
    const next: Next | null = last && {};

    if (next) {
      for (const key of Object.keys(paginateAchievementRequest)) {
        if (!paginateAchievementRequest[key]) {
          continue;
        }
        if (key !== 'where__id__less_than') {
          next[key] = paginateAchievementRequest[key];
        }
      }
      next.where__id__less_than = parseInt(last.id.toString());
    }

    return next ?? null;
  }
}
