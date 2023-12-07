import { IAchievementDetail } from '../index';
import { ApiProperty } from '@nestjs/swagger';
import { CategoryInfo } from './category-info';
import { dateFormat } from '../../common/utils/date-formatter';

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
  createdAt: string;
  @ApiProperty({ type: CategoryInfo, description: 'data' })
  category: CategoryInfo;
  constructor(achievementDetail: IAchievementDetail) {
    this.id = achievementDetail.id;
    this.title = achievementDetail.title;
    this.content = achievementDetail.content;
    this.imageUrl = achievementDetail.imageUrl;
    this.createdAt = dateFormat(new Date(achievementDetail.createdAt));
    this.category = new CategoryInfo(
      achievementDetail.categoryId || -1,
      achievementDetail.categoryName || '미설정',
      Number(achievementDetail.achieveCount),
    );
  }
}
