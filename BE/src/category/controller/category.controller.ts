import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CategoryService } from '../application/category.service';
import { CategoryCreate } from '../dto/category-create';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiData } from '../../common/api/api-data';
import { AuthenticatedUser } from '../../auth/decorator/athenticated-user.decorator';
import { User } from '../../users/domain/user.domain';
import { AccessTokenGuard } from '../../auth/guard/access-token.guard';
import { CategoryResponse } from '../dto/category.response';
import { CategoryListElementResponse } from '../dto/category-list-element.response';

@Controller('/api/v1/categories')
@ApiTags('카테고리 API')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: '카테고리 생성 API',
    description: '카테고리를 생성합니다.',
  })
  @ApiBearerAuth('accessToken')
  async saveCategory(
    @Body() categoryCreate: CategoryCreate,
    @AuthenticatedUser() user: User,
  ) {
    const category = await this.categoryService.saveCategory(
      categoryCreate,
      user,
    );
    return ApiData.success(CategoryResponse.from(category));
  }

  @Get()
  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '카테고리 조회 API',
    description: '사용자 본인에 대한 카테고리를 조회합니다.',
  })
  @ApiBearerAuth('accessToken')
  async getCategories(
    @AuthenticatedUser() user: User,
  ): Promise<ApiData<CategoryListElementResponse[]>> {
    const categories = await this.categoryService.getCategoriesByUser(user);
    return ApiData.success(CategoryListElementResponse.build(categories));
  }
}
