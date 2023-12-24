import { IsNotEmptyString } from '../../config/config/validation-decorator';
import { ApiProperty } from '@nestjs/swagger';

export class CategoryCreate {
  @IsNotEmptyString({ message: '잘못된 카테고리 이름입니다.' })
  @ApiProperty({ description: '카테고리 이름' })
  name: string;

  constructor(name: string) {
    this.name = name;
  }
}
