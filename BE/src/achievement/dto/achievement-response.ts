import { Achievement } from '../domain/achievement.domain';

export class AchievementResponse {
  id: number;
  thumbnailUrl: string;
  title: string;

  constructor(id: number, thumbnailUrl: string, title: string) {
    this.id = id;
    this.thumbnailUrl = thumbnailUrl;
    this.title = title;
  }

  static from(achievement: Achievement) {
    return new AchievementResponse(
      achievement.id,
      achievement.thumbnailUrl,
      achievement.title,
    );
  }
}
