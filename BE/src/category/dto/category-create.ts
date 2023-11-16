import { IsNotEmptyString } from '../../config/config/validation-decorator';
import { ApiProperty } from '@nestjs/swagger';
import { Category } from '../domain/category.domain';
import { User } from '../../users/domain/user.domain';

export class CategoryCreate {
  @IsNotEmptyString({ message: '잘못된 카테고리 이름입니다.' })
  @ApiProperty({ description: '카테고리 이름' })
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  toModel(user: User): Category {
    return new Category(user, this.name);
  }
}
