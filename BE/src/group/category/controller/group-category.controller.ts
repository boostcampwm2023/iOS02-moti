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
  UseGuards,
} from '@nestjs/common';
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
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { GroupCategoryRelocateRequest } from '../dto/group-category-relocate';

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
  @ApiOkResponse({
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

  @ApiBearerAuth('accessToken')
  @ApiOperation({
    summary: '그룹 카테고리 단 건 조회 API',
    description: '특정 그룹 카테고리를 조회한다.',
  })
  @ApiOkResponse({
    description: '그룹 카테고리 조회',
    type: GroupCategoryListElementResponse,
  })
  @Get(':categoryId')
  @UseGuards(AccessTokenGuard)
  async category(
    @AuthenticatedUser() user: User,
    @Param('groupId', ParseIntPipe) groupId: number,
    @Param('categoryId', ParseIntPipe) categoryId: number,
  ): Promise<ApiData<GroupCategoryListElementResponse>> {
    const groupCategory =
      await this.groupCategoryService.retrieveCategoryMetadataById(
        user,
        groupId,
        categoryId,
      );
    return ApiData.success(new GroupCategoryListElementResponse(groupCategory));
  }

  @ApiBearerAuth('accessToken')
  @ApiOperation({
    summary: '그룹 카테고리 순서 변경 API',
    description:
      '변경될 그룹의 카테고리 순서로 카테고리 아이디를 배열의 형태로 요청한다.',
  })
  @Put()
  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.OK)
  async relocateCategory(
    @Body() categoryRelocateRequest: GroupCategoryRelocateRequest,
    @Param('groupId', ParseIntPipe) groupId: number,
    @AuthenticatedUser() user: User,
  ) {
    return ApiData.success(
      await this.groupCategoryService.relocateCategory(
        user,
        groupId,
        categoryRelocateRequest,
      ),
    );
  }

  @ApiBearerAuth('accessToken')
  @ApiOperation({
    summary: '카테고리 삭제 API',
    description: '카테고리를 삭제한다.',
  })
  @Delete('/:categoryId')
  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.OK)
  async deleteCategory(
    @Param('groupId', ParseIntPipe) groupId: number,
    @Param('categoryId', ParseIntPipe) categoryId: number,
    @AuthenticatedUser() user: User,
  ) {
    return ApiData.success(
      await this.groupCategoryService.deleteCategory(user, groupId, categoryId),
    );
  }
}
