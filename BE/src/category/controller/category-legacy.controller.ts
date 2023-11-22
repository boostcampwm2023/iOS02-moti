import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { CategoryService } from '../application/category.service';
import { AccessTokenGuard } from '../../auth/guard/access-token.guard';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthenticatedUser } from '../../auth/decorator/athenticated-user.decorator';
import { User } from '../../users/domain/user.domain';
import { ApiData } from '../../common/api/api-data';
import { CategoryListLegacyResponse } from '../dto/category-list-legacy.response';

@Controller('/api/legacy/categories')
@ApiTags('카테고리 API - Legacy')
export class CategoryLegacyController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '카테고리 조회 API',
    description:
      '사용자 본인에 대한 카테고리를 조회합니다.(Legacy)\nAPI 포맷이 변경되었습니다.',
  })
  async getCategoriesLegacy(
    @AuthenticatedUser() user: User,
  ): Promise<ApiData<CategoryListLegacyResponse>> {
    const categories = await this.categoryService.getCategoriesByUser(user);
    return ApiData.success(new CategoryListLegacyResponse(categories));
  }
}
