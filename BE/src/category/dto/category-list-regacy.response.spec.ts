import { CategoryMetaData } from './category-metadata';
import { CategoryListLegacyResponse } from './category-list-legacy.response';

describe('CategoryListLegacyResponse', () => {
  describe('생성된 카테고리가 없더라도 응답이 가능하다.', () => {
    it('카테고리 메타데이터가 빈 배열일 때 응답이 가능하다.', () => {
      // given
      const categoryMetaData: CategoryMetaData[] = [];

      // when
      const categoryListResponse = new CategoryListLegacyResponse(
        categoryMetaData,
      );

      // then
      expect(categoryListResponse).toBeDefined();
      expect(Object.keys(categoryListResponse.categories)).toHaveLength(1);
      expect(categoryListResponse.categoryNames).toHaveLength(1);
      expect(categoryListResponse.categoryNames).toContain('전체');
      expect(categoryListResponse.categories).toHaveProperty('전체');
      expect(categoryListResponse.categories['전체'].id).toBe(0);
      expect(categoryListResponse.categories['전체'].name).toBe('전체');
      expect(categoryListResponse.categories['전체'].continued).toBe(0);
      expect(categoryListResponse.categories['전체'].lastChallenged).toBeNull();
    });

    it('카테고리 메타데이터가 undefined일 때 응답이 가능하다.', () => {
      // given
      const categoryMetaData: CategoryMetaData[] = undefined;

      // when
      const categoryListResponse = new CategoryListLegacyResponse(
        categoryMetaData,
      );

      // then
      expect(categoryListResponse).toBeDefined();
      expect(Object.keys(categoryListResponse.categories)).toHaveLength(1);
      expect(categoryListResponse.categoryNames).toHaveLength(1);
      expect(categoryListResponse.categoryNames).toContain('전체');
      expect(categoryListResponse.categories).toHaveProperty('전체');
      expect(categoryListResponse.categories['전체'].id).toBe(0);
      expect(categoryListResponse.categories['전체'].name).toBe('전체');
      expect(categoryListResponse.categories['전체'].continued).toBe(0);
      expect(categoryListResponse.categories['전체'].lastChallenged).toBeNull();
    });
  });

  describe('생성된 카테고리가 있을 때 응답이 가능하다.', () => {
    it('다수의 카테고리에 대해 응답이 가능하다.', () => {
      // given
      const categoryMetaData: CategoryMetaData[] = [];
      categoryMetaData.push(
        new CategoryMetaData({
          categoryId: 1,
          categoryName: '카테고리1',
          insertedAt: new Date('2021-01-01T00:00:00.000Z').toISOString(),
          achievementCount: '1',
        }),
      );
      categoryMetaData.push(
        new CategoryMetaData({
          categoryId: 2,
          categoryName: '카테고리2',
          insertedAt: new Date('2021-01-02T00:00:00.000Z').toISOString(),
          achievementCount: '2',
        }),
      );

      // when
      const categoryListResponse = new CategoryListLegacyResponse(
        categoryMetaData,
      );

      // then
      expect(categoryListResponse).toBeDefined();
      expect(Object.keys(categoryListResponse.categories)).toHaveLength(3);
      expect(categoryListResponse.categoryNames).toHaveLength(3);
      expect(categoryListResponse.categories).toHaveProperty('전체');
      expect(categoryListResponse.categoryNames).toContain('전체');
      expect(categoryListResponse.categories).toHaveProperty('카테고리1');
      expect(categoryListResponse.categoryNames).toContain('카테고리1');
      expect(categoryListResponse.categories).toHaveProperty('카테고리2');
      expect(categoryListResponse.categoryNames).toContain('카테고리2');
      expect(categoryListResponse.categories['전체']).toEqual({
        id: 0,
        name: '전체',
        continued: 3,
        lastChallenged: '2021-01-02T00:00:00Z',
      });
      expect(categoryListResponse.categories['카테고리1']).toEqual({
        id: 1,
        name: '카테고리1',
        continued: 1,
        lastChallenged: '2021-01-01T00:00:00Z',
      });
      expect(categoryListResponse.categories['카테고리2']).toEqual({
        id: 2,
        name: '카테고리2',
        continued: 2,
        lastChallenged: '2021-01-02T00:00:00Z',
      });
    });
  });
});
