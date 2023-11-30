import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { GroupCategoryService } from '../application/group-category.service';
import { AccessTokenGuard } from '../../../auth/guard/access-token.guard';
import { AuthenticatedUser } from '../../../auth/decorator/athenticated-user.decorator';
import { User } from '../../../users/domain/user.domain';
import { GroupCategoryCreate } from '../dto/group-category-create';
import { ApiData } from '../../../common/api/api-data';
import { GroupCategoryResponse } from '../dto/group-category-response';
import { ParseIntPipe } from '../../../common/pipe/parse-int.pipe';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('그룹 카테고리 API')
@Controller('/api/v1/groups/:groupId/categories')
export class GroupCategoryController {
  constructor(private readonly groupCategoryService: GroupCategoryService) {}

  @ApiOperation({
    summary: '그룹 카테고리 생성 API',
    description: '그룹 카테고리를 생성한다.',
  })
  @ApiCreatedResponse({
    description: '그룹 카테고리 생성',
    type: GroupCategoryResponse,
  })
  @Post()
  @UseGuards(AccessTokenGuard)
  async createGroupCategory(
    @AuthenticatedUser() user: User,
    @Param('groupId', ParseIntPipe) groupId: number,
    @Body() groupCtgCreate: GroupCategoryCreate,
  ): Promise<ApiData<GroupCategoryResponse>> {
    const groupCategory = await this.groupCategoryService.createGroupCategory(
      user,
      groupId,
      groupCtgCreate,
    );
    return ApiData.success(GroupCategoryResponse.from(groupCategory));
  }
}
