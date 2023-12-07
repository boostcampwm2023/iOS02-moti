import { ApiProperty } from '@nestjs/swagger';
import { Emoji } from '../domain/emoji';

export class GroupAchievementEmojiResponse {
  @ApiProperty({ description: '그룹 도전기록 이모지' })
  id: Emoji;

  @ApiProperty({ description: '토글 여부' })
  isSelected: boolean;

  static of(id: Emoji, isSelected: boolean): GroupAchievementEmojiResponse {
    const response = new GroupAchievementEmojiResponse();
    response.id = id;
    response.isSelected = isSelected;
    return response;
  }
}
