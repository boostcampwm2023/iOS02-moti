import { Achievement } from '../domain/achievement.domain';
import { ApiProperty } from '@nestjs/swagger';
import { Category } from '../../category/domain/category.domain';

export class AchievementResponse {
  @ApiProperty({ description: 'id' })
  id: number;
  @ApiProperty({ description: 'thumbnailUrl' })
  thumbnailUrl: string;
  @ApiProperty({ description: 'title' })
  title: string;
  @ApiProperty({ description: 'categoryId' })
  categoryId: number;

  constructor(
    id: number,
    thumbnailUrl: string,
    title: string,
    category?: Category,
  ) {
    this.id = id;
    this.thumbnailUrl = thumbnailUrl;
    this.title = title;
    this.categoryId = category ? category.id : -1;
  }

  static from(achievement: Achievement) {
    return new AchievementResponse(
      achievement.id,
      achievement.image?.thumbnailUrl || achievement.image?.imageUrl || null,
      achievement.title,
      achievement.category,
    );
  }
}
