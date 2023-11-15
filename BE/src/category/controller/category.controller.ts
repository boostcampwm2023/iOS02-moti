import {Body, Controller, HttpCode, HttpStatus, Post, UseGuards} from '@nestjs/common';
import { CategoryService } from '../application/category.service';
import { CategoryCreate } from '../dto/category-create';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiData } from '../../common/api/api-data';
import { AuthenticatedUser } from '../../auth/decorator/athenticated-user.decorator';
import { User } from '../../users/domain/user.domain';
import { AccessTokenGuard } from '../../auth/guard/access-token.guard';

@Controller('/api/v1/category')
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
  async saveCategory(
    @Body() categoryCreate: CategoryCreate,
    @AuthenticatedUser() user: User,
  ) {
    const category = await this.categoryService.saveCategory(
      categoryCreate,
      user,
    );
    return ApiData.success(category);
  }
}
