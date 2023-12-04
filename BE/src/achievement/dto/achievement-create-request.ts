import { IsNotEmptyString } from '../../config/config/validation-decorator';
import { IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Achievement } from '../domain/achievement.domain';
import { User } from '../../users/domain/user.domain';
import { Category } from '../../category/domain/category.domain';
import { Image } from '../../image/domain/image.domain';

export class AchievementCreateRequest {
  @IsNotEmptyString({ message: '잘못된 제목입니다.' })
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

  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: '사진을 선택해주세요' },
  )
  @ApiProperty({ description: 'photoId' })
  photoId: number;

  constructor(
    title: string,
    content: string,
    categoryId: number,
    photoId: number,
  ) {
    this.title = title;
    this.content = content;
    this.categoryId = categoryId;
    this.photoId = photoId;
  }

  toModel(user: User, category: Category, image: Image): Achievement {
    return new Achievement(user, category, this.title, this.content, image);
  }
}
