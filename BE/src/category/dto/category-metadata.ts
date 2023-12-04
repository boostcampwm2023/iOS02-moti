import { ICategoryMetaData } from '../index';

export class CategoryMetaData {
  categoryId: number;
  categoryName: string;
  insertedAt: Date;
  achievementCount: number;

  constructor(categoryMetaData: ICategoryMetaData) {
    this.categoryId = isNaN(parseInt(categoryMetaData.categoryId))
      ? -1
      : parseInt(categoryMetaData.categoryId);
    this.categoryName = categoryMetaData.categoryName || '미설정';
    this.insertedAt = categoryMetaData.insertedAt
      ? new Date(categoryMetaData.insertedAt)
      : null;
    this.achievementCount = isNaN(Number(categoryMetaData.achievementCount))
      ? 0
      : parseInt(categoryMetaData.achievementCount);
  }
}
