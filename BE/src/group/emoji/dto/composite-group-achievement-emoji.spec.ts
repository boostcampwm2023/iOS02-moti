import { GroupAchievementEmojiListElement } from './group-achievement-emoji-list-element';
import { CompositeGroupAchievementEmoji } from './composite-group-achievement-emoji';
import { Emoji } from '../domain/emoji';

describe('CompositeGroupAchievementEmoji Test', () => {
  it('CompositeGroupAchievementEmoji는 metadata가 없어도 생성된다.', () => {
    // given
    const metadata: GroupAchievementEmojiListElement[] = null;

    // when
    const result = CompositeGroupAchievementEmoji.of(metadata);

    // then
    expect(result).toBeInstanceOf(CompositeGroupAchievementEmoji);
    expect(result.LIKE).toBeInstanceOf(GroupAchievementEmojiListElement);
    expect(result.FIRE.id).toBe(Emoji.FIRE);
    expect(result.FIRE.count).toBe(0);
    expect(result.FIRE.isSelected).toBe(false);
    expect(result.SMILE.id).toBe(Emoji.SMILE);
    expect(result.SMILE.count).toBe(0);
    expect(result.SMILE.isSelected).toBe(false);
    expect(result.LIKE.id).toBe(Emoji.LIKE);
    expect(result.LIKE.count).toBe(0);
    expect(result.LIKE.isSelected).toBe(false);
  });

  it('CompositeGroupAchievementEmoji는 metadata가 없어도 생성된다.', () => {
    // given
    const metadata: GroupAchievementEmojiListElement[] = undefined;

    // when
    const result = CompositeGroupAchievementEmoji.of(metadata);

    // then
    expect(result).toBeInstanceOf(CompositeGroupAchievementEmoji);
    expect(result.LIKE).toBeInstanceOf(GroupAchievementEmojiListElement);
    expect(result.FIRE.id).toBe(Emoji.FIRE);
    expect(result.FIRE.count).toBe(0);
    expect(result.FIRE.isSelected).toBe(false);
    expect(result.SMILE.id).toBe(Emoji.SMILE);
    expect(result.SMILE.count).toBe(0);
    expect(result.SMILE.isSelected).toBe(false);
    expect(result.LIKE.id).toBe(Emoji.LIKE);
    expect(result.LIKE.count).toBe(0);
    expect(result.LIKE.isSelected).toBe(false);
  });

  it('CompositeGroupAchievementEmoji는 metadata가 없어도 생성된다.', () => {
    // given
    const metadata: GroupAchievementEmojiListElement[] = [
      new GroupAchievementEmojiListElement(),
    ];
    metadata[0].id = Emoji.LIKE;
    metadata[0].count = 5;
    metadata[0].isSelected = true;

    // when
    const result = CompositeGroupAchievementEmoji.of(metadata);

    // then
    expect(result).toBeInstanceOf(CompositeGroupAchievementEmoji);
    expect(result.LIKE).toBeInstanceOf(GroupAchievementEmojiListElement);
    expect(result.FIRE.id).toBe(Emoji.FIRE);
    expect(result.FIRE.count).toBe(0);
    expect(result.FIRE.isSelected).toBe(false);
    expect(result.SMILE.id).toBe(Emoji.SMILE);
    expect(result.SMILE.count).toBe(0);
    expect(result.SMILE.isSelected).toBe(false);
    expect(result.LIKE.id).toBe(Emoji.LIKE);
    expect(result.LIKE.count).toBe(5);
    expect(result.LIKE.isSelected).toBe(true);
  });

  it('CompositeGroupAchievementEmoji는 metadata가 없어도 생성된다.', () => {
    // given
    const metadata: GroupAchievementEmojiListElement[] = [
      new GroupAchievementEmojiListElement(),
      new GroupAchievementEmojiListElement(),
      new GroupAchievementEmojiListElement(),
    ];
    metadata[0].id = Emoji.LIKE;
    metadata[0].count = 5;
    metadata[0].isSelected = true;
    metadata[1].id = Emoji.FIRE;
    metadata[1].count = 3;
    metadata[1].isSelected = false;
    metadata[2].id = Emoji.SMILE;
    metadata[2].count = 1;
    metadata[2].isSelected = false;

    // when
    const result = CompositeGroupAchievementEmoji.of(metadata);

    // then
    expect(result).toBeInstanceOf(CompositeGroupAchievementEmoji);
    expect(result.FIRE.id).toBe(Emoji.FIRE);
    expect(result.FIRE.count).toBe(3);
    expect(result.FIRE.isSelected).toBe(false);
    expect(result.SMILE.id).toBe(Emoji.SMILE);
    expect(result.SMILE.count).toBe(1);
    expect(result.SMILE.isSelected).toBe(false);
    expect(result.LIKE.id).toBe(Emoji.LIKE);
    expect(result.LIKE.count).toBe(5);
    expect(result.LIKE.isSelected).toBe(true);
  });

  it('toResponse는 일정한 이모지 순서로 반환한다.', () => {
    // given
    const metadata: GroupAchievementEmojiListElement[] = [
      new GroupAchievementEmojiListElement(),
      new GroupAchievementEmojiListElement(),
      new GroupAchievementEmojiListElement(),
    ];
    metadata[0].id = Emoji.LIKE;
    metadata[0].count = 5;
    metadata[0].isSelected = true;
    metadata[1].id = Emoji.FIRE;
    metadata[1].count = 3;
    metadata[1].isSelected = false;
    metadata[2].id = Emoji.SMILE;
    metadata[2].count = 1;
    metadata[2].isSelected = false;

    // when
    const result = CompositeGroupAchievementEmoji.of(metadata).toResponse();

    // then
    expect(result[0].id).toBe(Emoji.LIKE);
    expect(result[1].id).toBe(Emoji.FIRE);
    expect(result[2].id).toBe(Emoji.SMILE);
  });

  it('toResponse는 일정한 이모지 순서로 반환한다.', () => {
    // given
    const metadata: GroupAchievementEmojiListElement[] = null;

    // when
    const result = CompositeGroupAchievementEmoji.of(metadata).toResponse();

    // then
    expect(result[0].id).toBe(Emoji.LIKE);
    expect(result[1].id).toBe(Emoji.FIRE);
    expect(result[2].id).toBe(Emoji.SMILE);
  });
});
