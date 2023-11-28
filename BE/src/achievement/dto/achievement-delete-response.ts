import { Achievement } from '../domain/achievement.domain';
import { ApiProperty } from '@nestjs/swagger';

export class AchievementDeleteResponse {
  @ApiProperty({ description: 'id' })
  id: number;

  constructor(id: number) {
    this.id = id;
  }

  static from(achievement: Achievement) {
    return new AchievementDeleteResponse(achievement.id);
  }
}
