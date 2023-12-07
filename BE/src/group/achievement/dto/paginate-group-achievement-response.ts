import { GroupAchievementResponse } from './group-achievement-response';
import { PaginateGroupAchievementRequest } from './paginate-group-achievement-request';
import { ApiProperty } from '@nestjs/swagger';
import { Next } from '../../../achievement';

export class PaginateGroupAchievementResponse {
  @ApiProperty({ type: [GroupAchievementResponse], description: 'data' })
  data: GroupAchievementResponse[];
  @ApiProperty({ description: 'count' })
  count: number;
  @ApiProperty({ description: 'next' })
  next: Next | null;

  constructor(
    paginateAchievementRequest: PaginateGroupAchievementRequest,
    achievements: GroupAchievementResponse[],
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
    paginateAchievementRequest: PaginateGroupAchievementRequest,
    last: GroupAchievementResponse,
  ) {
    const next: Next | null = last && {};

    if (next) {
      for (const key of Object.keys(paginateAchievementRequest)) {
        if (key !== 'whereIdLessThan') {
          next[key] = paginateAchievementRequest[key];
        }
      }
      next.whereIdLessThan = parseInt(last.id.toString());
    }

    return next ?? null;
  }
}
