import { IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GroupCategoryRelocateRequest {
  @IsArray({
    message: '요청 형식이 잘 못 되었습니다.',
  })
  @ApiProperty({
    description: '변경할 카테고리 아이디의 순서',
  })
  order: number[];

  getCategoryCount() {
    return this.order.length;
  }
}
