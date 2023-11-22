import { IAchievementDetail } from '../index';
import { ApiProperty } from '@nestjs/swagger';
import { CategoryInfo } from './category-info';

export class AchievementDetailResponse {
  // @ApiProperty({ type: [AchievementResponse], description: 'data' })
  @ApiProperty({ description: 'id' })
  id: number;
  @ApiProperty({ description: 'imageUrl' })
  imageUrl: string;
  @ApiProperty({ description: 'title' })
  title: string;
  @ApiProperty({ description: 'content' })
  content: string;
  @ApiProperty({ description: 'createdAt' })
  createdAt: Date;
  @ApiProperty({ type: CategoryInfo, description: 'data' })
  category: CategoryInfo;
  constructor(achievementDetail: IAchievementDetail) {
    this.id = achievementDetail.id;
    this.title = achievementDetail.title;
    this.content = achievementDetail.content;
    this.imageUrl = achievementDetail.imageUrl;
    this.createdAt = new Date(achievementDetail.createdAt);
    this.category = new CategoryInfo(
      achievementDetail.categoryId,
      achievementDetail.categoryName,
      Number(achievementDetail.achieveCount),
    );
  }
}
