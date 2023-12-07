import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { GroupAchievementEmojiService } from '../application/group-achievement-emoji.service';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AccessTokenGuard } from '../../../auth/guard/access-token.guard';
import { AuthenticatedUser } from '../../../auth/decorator/athenticated-user.decorator';
import { User } from '../../../users/domain/user.domain';
import { ParseIntPipe } from '../../../common/pipe/parse-int.pipe';
import { Emoji } from '../domain/emoji';
import { ApiData } from '../../../common/api/api-data';
import { GroupAchievementEmojiResponse } from '../dto/group-achievement-emoji-response';
import { ParseEmojiPipe } from '../../../common/pipe/parse-emoji.pipe';
import { GroupAchievementEmojiListElement } from '../dto/group-achievement-emoji-list-element';

@ApiTags('그룹 도전기록 이모지 API')
@Controller('/api/v1/groups/:groupId/achievements/:achievementId/emojis')
export class GroupAchievementEmojiController {
  constructor(
    private readonly groupAchievementEmojiService: GroupAchievementEmojiService,
  ) {}

  @ApiBearerAuth('accessToken')
  @ApiOperation({
    summary: '그룹 도전기록 이모지 토글 API',
    description: '그룹 도전기록에 요청한 이모지를 토글한다.',
  })
  @ApiOkResponse({
    description: '그룹 도전기록 이모지 토글',
    type: GroupAchievementEmojiResponse,
  })
  @Post('/:emoji')
  @UseGuards(AccessTokenGuard)
  async toggleAchievementEmoji(
    @AuthenticatedUser() user: User,
    @Param('groupId', ParseIntPipe) groupId: number,
    @Param('achievementId', ParseIntPipe) achievementId: number,
    @Param('emoji', ParseEmojiPipe) emoji: Emoji,
  ): Promise<ApiData<GroupAchievementEmojiResponse>> {
    const groupAchievementEmojiResponse =
      await this.groupAchievementEmojiService.toggleAchievementEmoji(
        user,
        groupId,
        achievementId,
        emoji,
      );
    return ApiData.success(groupAchievementEmojiResponse);
  }

  @ApiBearerAuth('accessToken')
  @ApiOperation({
    summary: '그룹 도전기록 이모지 조회 API',
    description: '그룹 도전기록에 요청한 이모지를 조회한다.',
  })
  @ApiOkResponse({
    description: '그룹 도전기록 이모지 조회',
    type: [GroupAchievementEmojiListElement],
  })
  @Get()
  @UseGuards(AccessTokenGuard)
  async retrieveGroupAchievementEmoji(
    @AuthenticatedUser() user: User,
    @Param('groupId', ParseIntPipe) groupId: number,
    @Param('achievementId', ParseIntPipe) achievementId: number,
  ): Promise<ApiData<GroupAchievementEmojiListElement[]>> {
    const groupAchievementEmojiResponse: GroupAchievementEmojiListElement[] =
      await this.groupAchievementEmojiService.getGroupAchievementEmojiCount(
        user,
        achievementId,
      );
    return ApiData.success(groupAchievementEmojiResponse);
  }
}
