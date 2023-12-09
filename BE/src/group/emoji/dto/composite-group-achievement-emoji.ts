import { GroupAchievementEmojiListElement } from './group-achievement-emoji-list-element';
import { Emoji } from '../domain/emoji';

export class CompositeGroupAchievementEmoji {
  LIKE: GroupAchievementEmojiListElement;
  FIRE: GroupAchievementEmojiListElement;
  SMILE: GroupAchievementEmojiListElement;

  static of(metatdata: GroupAchievementEmojiListElement[]) {
    const response = new CompositeGroupAchievementEmoji();
    response.LIKE =
      metatdata?.find((meta) => meta.id === Emoji.LIKE) ||
      GroupAchievementEmojiListElement.noEmoji(Emoji.LIKE);
    response.FIRE =
      metatdata?.find((meta) => meta.id === Emoji.FIRE) ||
      GroupAchievementEmojiListElement.noEmoji(Emoji.FIRE);
    response.SMILE =
      metatdata?.find((meta) => meta.id === Emoji.SMILE) ||
      GroupAchievementEmojiListElement.noEmoji(Emoji.SMILE);
    return response;
  }

  toResponse(): GroupAchievementEmojiListElement[] {
    return [this.LIKE, this.FIRE, this.SMILE];
  }
}
