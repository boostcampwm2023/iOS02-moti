import { IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GroupRelocateRequest {
  @IsArray({
    message: '요청 형식이 잘 못 되었습니다.',
  })
  @ApiProperty({
    description: '변경할 그룹의 아이디의 순서',
  })
  order: number[];

  getGroupCount() {
    return this.order.length;
  }
}
