import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AchievementService } from '../application/achievement.service';
import { AccessTokenGuard } from '../../auth/guard/access-token.guard';
import { AuthenticatedUser } from '../../auth/decorator/athenticated-user.decorator';
import { User } from '../../users/domain/user.domain';
import { ApiData } from '../../common/api/api-data';
import { PaginateAchievementRequest } from '../dto/paginate-achievement-request';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PaginateAchievementResponse } from '../dto/paginate-achievement-response';
import { AchievementDetailResponse } from '../dto/achievement-detail-response';
import { ParseIntPipe } from '../../common/pipe/parse-int.pipe';
import { AchievementDeleteResponse } from '../dto/achievement-delete-response';
import { AchievementUpdateRequest } from '../dto/achievement-update-request';
import { AchievementUpdateResponse } from '../dto/achievement-update-response';
import { AchievementCreateRequest } from '../dto/achievement-create-request';

@Controller('/api/v1/achievements')
@ApiTags('달성기록 API')
export class AchievementController {
  constructor(private readonly achievementService: AchievementService) {}

  @ApiBearerAuth('accessToken')
  @ApiOperation({
    summary: '달성기록 리스트 API',
    description: '달성기록 리스트를 커서 페이지네이션 기반으로 조회한다.',
  })
  @ApiResponse({
    status: 200,
    description: '달성기록 리스트',
    type: PaginateAchievementResponse,
  })
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

  @ApiBearerAuth('accessToken')
  @ApiOperation({
    summary: '달성기록 상세정보 API',
    description: '달성기록 리스트를 커서 페이지네이션 기반으로 조회한다.',
  })
  @ApiResponse({
    status: 200,
    description: '달성기록 상세정보',
    type: AchievementDetailResponse,
  })
  @Get('/:id')
  @UseGuards(AccessTokenGuard)
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

  @ApiBearerAuth('accessToken')
  @ApiOperation({
    summary: '달성기록 삭제 API',
    description: '달성기록을 삭제한다.',
  })
  @ApiResponse({
    status: 200,
    description: '달성기록 삭제',
    type: AchievementDeleteResponse,
  })
  @Delete('/:id')
  @UseGuards(AccessTokenGuard)
  async delete(
    @AuthenticatedUser() user: User,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return ApiData.success(await this.achievementService.delete(user.id, id));
  }

  @ApiBearerAuth('accessToken')
  @ApiOperation({
    summary: '달성기록 수정 API',
    description: '달성기록을 수정한다.',
  })
  @ApiResponse({
    status: 200,
    description: '달성기록 수정',
    type: AchievementUpdateResponse,
  })
  @Put('/:id')
  @UseGuards(AccessTokenGuard)
  async update(
    @AuthenticatedUser() user: User,
    @Param('id', ParseIntPipe) id: number,
    @Body() achievementUpdateRequest: AchievementUpdateRequest,
  ) {
    return ApiData.success(
      await this.achievementService.update(
        user.id,
        id,
        achievementUpdateRequest,
      ),
    );
  }

  @ApiBearerAuth('accessToken')
  @ApiOperation({
    summary: '달성기록 생성 API',
    description: '달성기록을 생성한다.',
  })
  @ApiResponse({
    status: 201,
    description: '달성기록 생성',
  })
  @Post()
  @UseGuards(AccessTokenGuard)
  async create(
    @AuthenticatedUser() user: User,
    @Body() achievementCreate: AchievementCreateRequest,
  ) {
    const achievement = await this.achievementService.create(
      user,
      achievementCreate,
    );
    return ApiData.success(achievement);
  }
}
