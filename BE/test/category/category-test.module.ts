import { CustomTypeOrmModule } from '../../src/config/typeorm/custom-typeorm.module';
import { Module } from '@nestjs/common';
import { CategoryRepository } from '../../src/category/entities/category.repository';
import { CategoryModule } from '../../src/category/category.module';
import { CategoryFixture } from './category-fixture';

@Module({
  imports: [
    CustomTypeOrmModule.forCustomRepository([CategoryRepository]),
    CategoryModule,
  ],
  providers: [CategoryFixture],
})
export class CategoryTestModule {}
