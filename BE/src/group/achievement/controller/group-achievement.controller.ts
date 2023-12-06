import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AccessTokenGuard } from '../../../auth/guard/access-token.guard';
import { AuthenticatedUser } from '../../../auth/decorator/athenticated-user.decorator';
import { User } from '../../../users/domain/user.domain';
import { ApiData } from '../../../common/api/api-data';
import { GroupAchievementService } from '../application/group-achievement.service';
import { ParseIntPipe } from '../../../common/pipe/parse-int.pipe';
import { RejectGroupAchievementResponse } from '../dto/reject-group-achievement-response.dto';
import { GroupAchievementCreateRequest } from '../dto/group-achievement-create-request';
import { PaginateGroupAchievementRequest } from '../dto/paginate-group-achievement-request';
import { PaginateGroupAchievementResponse } from '../dto/paginate-group-achievement-response';
import { AchievementDetailResponse } from '../../../achievement/dto/achievement-detail-response';
import { AchievementUpdateResponse } from '../../../achievement/dto/achievement-update-response';
import { AchievementUpdateRequest } from '../../../achievement/dto/achievement-update-request';
import { GroupAchievementUpdateRequest } from '../dto/group-achievement-update-request';
import { GroupAchievementUpdateResponse } from '../dto/group-achievement-update-response';
import { GroupAchievementDeleteResponse } from '../dto/group-achievement-delete-response';

@Controller('/api/v1/groups')
@ApiTags('그룹 달성기록 API')
export class GroupAchievementController {
  constructor(
    private readonly groupAchievementService: GroupAchievementService,
  ) {}

  @ApiOperation({
    summary: '특정 달성기록 차단 API',
    description: '특정 달성기록을 차단한다.',
  })
  @ApiResponse({
    description: '달성기록 차단',
    type: RejectGroupAchievementResponse,
  })
  @ApiBearerAuth('accessToken')
  @Post(`/:groupId/achievements/:achievementId/reject`)
  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.OK)
  async rejectAchievement(
    @AuthenticatedUser() user: User,
    @Param('groupId', ParseIntPipe) groupId: number,
    @Param('achievementId', ParseIntPipe) achievementId: number,
  ) {
    return ApiData.success(
      await this.groupAchievementService.reject(user, groupId, achievementId),
    );
  }

  @ApiBearerAuth('accessToken')
  @ApiOperation({
    summary: '그룹 달성기록 생성 API',
    description: '달성기록을 생성한다.',
  })
  @ApiResponse({
    status: 201,
    description: '그룹 달성기록 생성',
  })
  @Post(`/:groupId/achievements`)
  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.CREATED)
  async createAchievement(
    @AuthenticatedUser() user: User,
    @Param('groupId', ParseIntPipe) groupId: number,
    @Body() achievementCreate: GroupAchievementCreateRequest,
  ) {
    return ApiData.success(
      await this.groupAchievementService.create(
        user,
        groupId,
        achievementCreate,
      ),
    );
  }

  @ApiBearerAuth('accessToken')
  @ApiOperation({
    summary: '그룹 달성기록 상세정보 API',
    description: '달성기록 상세정보를 조회한다.',
  })
  @ApiResponse({
    status: 200,
    description: '그룹 달성기록 상세정보',
    type: AchievementDetailResponse,
  })
  @Get('/:groupId/achievements/:achievementId')
  @UseGuards(AccessTokenGuard)
  async getAchievement(
    @AuthenticatedUser() user: User,
    @Param('achievementId', ParseIntPipe) id: number,
  ) {
    const response = await this.groupAchievementService.getAchievementDetail(
      user,
      id,
    );
    return ApiData.success(response);
  }

  @ApiBearerAuth('accessToken')
  @ApiOperation({
    summary: '그룹 달성기록 리스트 API',
    description: '그룹 달성기록 리스트를 조회한다.',
  })
  @ApiResponse({
    status: 200,
    description: '그룹 달성기록 리스트',
    type: PaginateGroupAchievementResponse,
  })
  @Get(`/:groupId/achievements`)
  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.OK)
  async getAchievements(
    @AuthenticatedUser() user: User,
    @Param('groupId', ParseIntPipe) groupId: number,
    @Query() paginateGroupAchievementRequest: PaginateGroupAchievementRequest,
  ) {
    return ApiData.success(
      await this.groupAchievementService.getAchievements(
        user,
        groupId,
        paginateGroupAchievementRequest,
      ),
    );
  }

  @ApiBearerAuth('accessToken')
  @ApiOperation({
    summary: '그룹 달성기록 삭제 API',
    description: '달성기록을 삭제한다.',
  })
  @ApiResponse({
    status: 200,
    description: '그룹 달성기록 삭제',
    type: GroupAchievementDeleteResponse,
  })
  @Delete('/:groupId/achievements/:achievementId')
  @UseGuards(AccessTokenGuard)
  async delete(
    @AuthenticatedUser() user: User,
    @Param('groupId', ParseIntPipe) groupId: number,
    @Param('achievementId', ParseIntPipe) achievementId: number,
  ) {
    const response = await this.groupAchievementService.delete(
      user.id,
      groupId,
      achievementId,
    );
    return ApiData.success(response);
  }

  @ApiBearerAuth('accessToken')
  @ApiOperation({
    summary: '그룹 달성기록 수정 API',
    description: '그룹 달성기록을 수정한다.',
  })
  @ApiResponse({
    status: 200,
    description: '그룹 달성기록 수정',
    type: GroupAchievementUpdateResponse,
  })
  @Put('/:groupId/achievements/:achievementId')
  @UseGuards(AccessTokenGuard)
  async update(
    @AuthenticatedUser() user: User,
    @Param('groupId', ParseIntPipe) groupId: number,
    @Param('achievementId', ParseIntPipe) achievementId: number,
    @Body() groupAchievementUpdateRequest: GroupAchievementUpdateRequest,
  ) {
    const response = await this.groupAchievementService.update(
      user.id,
      groupId,
      achievementId,
      groupAchievementUpdateRequest,
    );
    return ApiData.success(response);
  }
}
