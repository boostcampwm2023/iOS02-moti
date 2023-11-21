import { IAchievementDetail } from '../index';

export class AchievementDetailResponse {
  id: number;
  imageUrl: string;
  title: string;
  content: string;
  createdAt: Date;
  category: {
    id: number;
    name: string;
    round: number;
  };
  constructor(achievementDetail: IAchievementDetail) {
    this.id = achievementDetail.id;
    this.title = achievementDetail.title;
    this.content = achievementDetail.content;
    this.imageUrl = achievementDetail.imageUrl;
    this.createdAt = new Date(achievementDetail.createdAt);
    this.category = {
      id: achievementDetail.categoryId,
      name: achievementDetail.categoryName,
      round: Number(achievementDetail.round),
    };
  }
}
