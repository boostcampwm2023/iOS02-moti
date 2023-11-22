import { ApiProperty } from '@nestjs/swagger';
import { Category } from '../domain/category.domain';

export class CategoryResponse {
  @ApiProperty({ description: '카테고리 아이디' })
  id: number;

  @ApiProperty({ description: '카테고리 이름' })
  name: string;

  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
  }

  static from(category: Category) {
    return new CategoryResponse(category.id, category.name);
  }
}
