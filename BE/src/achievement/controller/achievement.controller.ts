import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AchievementService } from '../application/achievement.service';
import { AccessTokenGuard } from '../../auth/guard/access-token.guard';
import { AuthenticatedUser } from '../../auth/decorator/athenticated-user.decorator';
import { User } from '../../users/domain/user.domain';
import { ApiData } from '../../common/api/api-data';
import { PaginateAchievementRequest } from '../dto/paginate-achievement-request';

@Controller('/api/v1/achievements')
export class AchievementController {
  constructor(private readonly achievementService: AchievementService) {}

  @Get()
  @UseGuards(AccessTokenGuard)
  async getAchievements(
    @AuthenticatedUser() user: User,
    @Query() paginateAchievementRequest: PaginateAchievementRequest,
  ) {
    const response = await this.achievementService.getAchievements(
      user.id,
      paginateAchievementRequest,
    );
    return ApiData.success(response);
  }
}
