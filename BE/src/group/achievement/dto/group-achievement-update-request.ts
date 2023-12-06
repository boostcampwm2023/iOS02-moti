import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { GroupCategory } from '../../category/domain/group.category';
import { GroupAchievementUpdate } from '../index';
import { IsNotEmptyString } from '../../../config/config/validation-decorator';

export class GroupAchievementUpdateRequest {
  @IsNotEmptyString({ message: '잘못된 제목 이름입니다.' })
  @ApiProperty({ description: 'title' })
  title: string;

  @IsString({ message: '잘못된 내용입니다.' })
  @ApiProperty({ description: 'content' })
  content: string;

  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: '카테고리를 선택해주세요' },
  )
  @ApiProperty({ description: 'categoryId' })
  categoryId: number;

  constructor(title: string, content: string, categoryId: number) {
    this.title = title;
    this.content = content;
    this.categoryId = categoryId;
  }

  toAchievementUpdate(category: GroupCategory): GroupAchievementUpdate {
    return {
      title: this.title,
      content: this.content,
      category,
    };
  }
}
