import { ApiProperty } from '@nestjs/swagger';
import { GroupAchievement } from '../domain/group-achievement.domain';

export class GroupAchievementDeleteResponse {
  @ApiProperty({ description: 'id' })
  id: number;

  constructor(id: number) {
    this.id = id;
  }

  static from(achievement: GroupAchievement) {
    return new GroupAchievementDeleteResponse(achievement.id);
  }
}
