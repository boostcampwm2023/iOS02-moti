import { User } from '../../../users/domain/user.domain';
import { Group } from '../../group/domain/group.domain';
import { GroupAchievement } from '../domain/group-achievement.domain';
import { Image } from '../../../image/domain/image.domain';
import { IsNotEmptyString } from '../../../config/config/validation-decorator';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { GroupCategory } from '../../category/domain/group.category';

export class GroupAchievementCreateRequest {
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

  toModel(
    user: User,
    group: Group,
    category: GroupCategory,
    image: Image,
  ): GroupAchievement {
    return new GroupAchievement(
      this.title,
      user,
      group,
      category,
      this.content,
      image,
    );
  }
}
