import { ApiProperty } from '@nestjs/swagger';
import { IGroupAchievementEmojiMetadata } from './index';
import { Emoji } from '../domain/emoji';

export class GroupAchievementEmojiListElement {
  @ApiProperty({ description: '그룹 도전기록 이모지' })
  id: string;

  @ApiProperty({ description: '토글 여부' })
  isSelected: boolean;

  @ApiProperty({ description: '이모지 개수' })
  count: number;

  static of(
    metatdata: IGroupAchievementEmojiMetadata,
  ): GroupAchievementEmojiListElement {
    const response = new GroupAchievementEmojiListElement();
    response.id = metatdata.id;
    response.count = isNaN(parseInt(metatdata.count))
      ? 0
      : parseInt(metatdata.count);
    response.isSelected = metatdata.isSelected == 1;
    return response;
  }

  static noEmoji(emoji: Emoji): GroupAchievementEmojiListElement {
    const response = new GroupAchievementEmojiListElement();
    response.id = emoji;
    response.count = 0;
    response.isSelected = false;
    return response;
  }
}
