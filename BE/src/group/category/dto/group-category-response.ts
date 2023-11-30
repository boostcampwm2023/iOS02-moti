import { ApiProperty } from '@nestjs/swagger';
import { GroupCategory } from '../domain/group.category';

export class GroupCategoryResponse {
  @ApiProperty({ description: '카테고리 아이디' })
  id: number;

  @ApiProperty({ description: '카테고리 이름' })
  name: string;

  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
  }

  static from(category: GroupCategory) {
    return new GroupCategoryResponse(category.id, category.name);
  }
}
