import { ICategoryMetaData } from '../index';

export class CategoryMetaData {
  categoryId: number;
  categoryName: string;
  insertedAt: Date;
  achievementCount: number;

  constructor(categoryMetaData: ICategoryMetaData) {
    this.categoryId = categoryMetaData.categoryId;
    this.categoryName = categoryMetaData.categoryName;
    this.insertedAt = categoryMetaData.insertedAt ? new Date() : null;
    this.achievementCount = isNaN(Number(categoryMetaData.achievementCount))
      ? 0
      : parseInt(categoryMetaData.achievementCount);
  }
}
