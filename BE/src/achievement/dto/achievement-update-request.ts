import { ApiProperty } from '@nestjs/swagger';
import { Category } from '../../category/domain/category.domain';
import { IsNotEmptyString } from '../../config/config/validation-decorator';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { AchievementUpdate } from '../index';

export class AchievementUpdateRequest {
  @IsNotEmptyString({ message: '잘못된 제목 이름입니다.' })
  @ApiProperty({ description: 'title' })
  title: string;

  @IsNotEmpty({ message: '잘못된 제목 이름입니다.' })
  @ApiProperty({ description: 'content' })
  content: string;

  @IsNumber()
  @ApiProperty({ description: 'categoryId' })
  categoryId: number;

  constructor(title: string, content: string, categoryId: number) {
    this.title = title;
    this.content = content;
    this.categoryId = categoryId;
  }

  toAchievementUpdate(category: Category): AchievementUpdate {
    return {
      title: this.title,
      content: this.content,
      category,
    };
  }
}
