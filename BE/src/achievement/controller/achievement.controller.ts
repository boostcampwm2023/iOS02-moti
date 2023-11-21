import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AchievementService } from '../application/achievement.service';
import { AccessTokenGuard } from '../../auth/guard/access-token.guard';
import { AuthenticatedUser } from '../../auth/decorator/athenticated-user.decorator';
import { User } from '../../users/domain/user.domain';
import { ApiData } from '../../common/api/api-data';
import { PaginateAchievementRequest } from '../dto/paginate-achievement-request';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaginateAchievementResponse } from '../dto/paginate-achievement-response';
import { AchievementDetailResponse } from '../dto/achievement-detail-response';

@Controller('/api/v1/achievements')
@ApiTags('달성기록 API')
export class AchievementController {
  constructor(private readonly achievementService: AchievementService) {}

  @Get()
  @UseGuards(AccessTokenGuard)
  @ApiOperation({
    summary: '달성기록 리스트 API',
    description: '달성기록 리스트를 커서 페이지네이션 기반으로 조회한다.',
  })
  @ApiResponse({
    status: 200,
    description: '달성기록 리스트',
    type: PaginateAchievementResponse,
  })
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

  @Get('/:id')
  @UseGuards(AccessTokenGuard)
  @ApiOperation({
    summary: '달성기록 상세정보 API',
    description: '달성기록 리스트를 커서 페이지네이션 기반으로 조회한다.',
  })
  @ApiResponse({
    status: 200,
    description: '달성기록 상세정보',
    type: AchievementDetailResponse,
  })
  async getAchievement(
    @AuthenticatedUser() user: User,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const response = await this.achievementService.getAchievementDetail(
      user.id,
      id,
    );
    return ApiData.success(response);
  }
}
