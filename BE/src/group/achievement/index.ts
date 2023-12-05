import { IAchievementDetail } from '../../achievement';

export interface IGroupAchievementDetail extends IAchievementDetail {
  userCode: string;
}

export interface IGroupAchievementListDetail {
  id: number;
  title: string;
  thumbnailUrl: string;
  userCode: string;
  categoryId: number;
}
