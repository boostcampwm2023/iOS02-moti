import { ApiProperty } from '@nestjs/swagger';
import { Category } from './category.domain';

export class CategoryResponse {
  @ApiProperty({ description: '카테고리 이름' })
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  static from(category: Category) {
    return new CategoryResponse(category.name);
  }
}
