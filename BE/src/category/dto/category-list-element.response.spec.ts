import { CategoryMetaData } from './category-metadata';
import { CategoryListElementResponse } from './category-list-element.response';

describe('CategoryListElementResponse Test', () => {
  it('전체가 0번 미설정이 1번에 포함되어야 한다.', () => {
    // given
    const categoryMetaData = [
      new CategoryMetaData({
        categoryId: '1',
        categoryName: '카테고리1',
        insertedAt: '2023-12-23T15:35:26Z',
        achievementCount: '1',
      }),
      new CategoryMetaData({
        categoryId: '2',
        categoryName: '카테고리2',
        insertedAt: '2023-12-23T15:35:26Z',
        achievementCount: '5',
      }),
    ];

    // when
    const categories = CategoryListElementResponse.build(categoryMetaData);

    // then

    expect(categories.length).toBe(4);
    expect(categories[0].id).toBe(0);
    expect(categories[0].name).toBe('전체');
    expect(categories[1].id).toBe(-1);
    expect(categories[1].name).toBe('미설정');
    expect(categories[2].id).toBe(1);
    expect(categories[2].name).toBe('카테고리1');
    expect(categories[3].id).toBe(2);
    expect(categories[3].name).toBe('카테고리2');
  });

  it('전체가 0번 미설정이 1번에 포함되어야 한다.', () => {
    // given
    const categoryMetaData = [];

    // when
    const categories = CategoryListElementResponse.build(categoryMetaData);

    // then
    expect(categories.length).toBe(2);
    expect(categories[0].id).toBe(0);
    expect(categories[0].name).toBe('전체');
    expect(categories[1].id).toBe(-1);
    expect(categories[1].name).toBe('미설정');
  });

  it('미설정 카테고리가 포함되어 있다면 새로 생성하지 않아야 한다.', () => {
    // given
    const categoryMetaData = [
      new CategoryMetaData({
        categoryId: '-1',
        categoryName: '미설정',
        insertedAt: '2023-12-23T15:35:26Z',
        achievementCount: '1',
      }),
      new CategoryMetaData({
        categoryId: '2',
        categoryName: '카테고리',
        insertedAt: '2023-12-23T15:35:26Z',
        achievementCount: '5',
      }),
    ];

    // when
    const categories = CategoryListElementResponse.build(categoryMetaData);

    // then
    expect(categories.length).toBe(3);
    expect(categories[0].id).toBe(0);
    expect(categories[0].name).toBe('전체');
    expect(categories[1].id).toBe(-1);
    expect(categories[1].name).toBe('미설정');
    expect(categories[2].id).toBe(2);
    expect(categories[2].name).toBe('카테고리');
  });
});
