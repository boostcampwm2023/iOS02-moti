import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { GroupCategoryService } from '../application/group-category.service';
import { AccessTokenGuard } from '../../../auth/guard/access-token.guard';
import { AuthenticatedUser } from '../../../auth/decorator/athenticated-user.decorator';
import { GroupCategoryListElementResponse } from '../dto/group-category-list-element.response';
import { User } from '../../../users/domain/user.domain';
import { GroupCategoryCreate } from '../dto/group-category-create';
import { ApiData } from '../../../common/api/api-data';
import { GroupCategoryResponse } from '../dto/group-category-response';
import { ParseIntPipe } from '../../../common/pipe/parse-int.pipe';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('그룹 카테고리 API')
@Controller('/api/v1/groups/:groupId/categories')
export class GroupCategoryController {
  constructor(private readonly groupCategoryService: GroupCategoryService) {}

  @ApiBearerAuth('accessToken')
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

  @ApiBearerAuth('accessToken')
  @ApiOperation({
    summary: '그룹 카테고리 리스트 API',
    description: '그룹 카테고리 리스트를 조회한다.',
  })
  @ApiCreatedResponse({
    description: '그룹 카테고리 조회',
    type: GroupCategoryListElementResponse,
  })
  @Get()
  @UseGuards(AccessTokenGuard)
  async categoryList(
    @AuthenticatedUser() user: User,
    @Param('groupId', ParseIntPipe) groupId: number,
  ): Promise<ApiData<GroupCategoryListElementResponse[]>> {
    const groupCategory =
      await this.groupCategoryService.retrieveCategoryMetadata(user, groupId);
    return ApiData.success(
      GroupCategoryListElementResponse.build(groupCategory),
    );
  }
}
