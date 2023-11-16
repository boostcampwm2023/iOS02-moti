import { Module } from '@nestjs/common';
import { CategoryController } from './controller/category.controller';
import { CategoryService } from './application/category.service';
import { CustomTypeOrmModule } from '../config/typeorm/custom-typeorm.module';
import { CategoryRepository } from './entities/category.repository';

@Module({
  controllers: [CategoryController],
  imports: [CustomTypeOrmModule.forCustomRepository([CategoryRepository])],
  providers: [CategoryService],
})
export class CategoryModule {}
