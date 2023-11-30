import { IsNotEmptyString } from '../../../config/config/validation-decorator';
import { ApiProperty } from '@nestjs/swagger';
import { GroupCategory } from '../domain/group.category';
import { User } from '../../../users/domain/user.domain';
import { Group } from '../../../group/group/domain/group.domain';

export class GroupCategoryCreate {
  @IsNotEmptyString({ message: '잘못된 카테고리 이름입니다.' })
  @ApiProperty({ description: '카테고리 이름' })
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  toModel(user: User, group: Group): GroupCategory {
    return new GroupCategory(user, group, this.name);
  }
}
