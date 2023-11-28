import { User } from '../users/domain/user.domain';
import { Category } from '../category/domain/category.domain';

export interface Next {
  whereIdLessThan?: number;
  take?: number;
  categoryId?: number;
}

export interface IAchievementDetail {
  id: number;
  title: string;
  content: string;
  imageUrl: string;
  createdAt: Date;
  categoryId: number;
  categoryName: string;
  achieveCount: number;
}

export interface AchievementUpdate {
  user?: User;
  category?: Category;
  title?: string;
  content?: string;
  imageUrl?: string;
  thumbnailUrl?: string;
}
