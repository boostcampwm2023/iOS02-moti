import { ApiProperty } from '@nestjs/swagger';
import { Emoji } from '../domain/emoji';

export class GroupAchievementEmojiListElement {
  @ApiProperty({ description: '그룹 도전기록 이모지' })
  id: string;

  @ApiProperty({ description: '토글 여부' })
  isSelected: boolean;

  @ApiProperty({ description: '이모지 개수' })
  count: number;

  static of(
    id: Emoji,
    count: number,
    isSelected: boolean,
  ): GroupAchievementEmojiListElement {
    const response = new GroupAchievementEmojiListElement();
    response.id = id;
    response.count = count;
    response.isSelected = isSelected;
    return response;
  }
}
