import { CustomTypeOrmModule } from '../../src/config/typeorm/custom-typeorm.module';
import { Module } from '@nestjs/common';
import { CategoryRepository } from '../../src/category/entities/category.repository';
import { CategoryModule } from '../../src/category/category.module';
import { CategoryFixture } from './category-fixture';
import { UserRepository } from '../../src/users/entities/user.repository';

@Module({
  imports: [
    CustomTypeOrmModule.forCustomRepository([
      CategoryRepository,
      UserRepository,
    ]),
    CategoryModule,
  ],
  providers: [CategoryFixture],
})
export class CategoryTestModule {}
