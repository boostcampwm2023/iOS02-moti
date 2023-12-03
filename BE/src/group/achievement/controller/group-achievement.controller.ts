import {
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post,
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
}
