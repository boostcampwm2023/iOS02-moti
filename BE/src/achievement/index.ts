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
