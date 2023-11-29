import { Achievement } from '../domain/achievement.domain';
import { ApiProperty } from '@nestjs/swagger';

export class AchievementResponse {
  @ApiProperty({ description: 'id' })
  id: number;
  @ApiProperty({ description: 'string' })
  thumbnailUrl: string;
  @ApiProperty({ description: 'string' })
  title: string;

  constructor(id: number, thumbnailUrl: string, title: string) {
    this.id = id;
    this.thumbnailUrl = thumbnailUrl;
    this.title = title;
  }

  static from(achievement: Achievement) {
    return new AchievementResponse(
      achievement.id,
      achievement.image?.thumbnailUrl || achievement.image?.imageUrl || null,
      achievement.title,
    );
  }
}
