import { CategoryMetaData } from './category-metadata';
import { dateFormat } from '../../common/utils/date-formatter';

export class CategoryListElementResponse {
  id: number;
  name: string;
  continued: number;
  lastChallenged: string;

  constructor(category: CategoryMetaData) {
    this.id = category.categoryId;
    this.name = category.categoryName;
    this.continued = category.achievementCount;
    this.lastChallenged = dateFormat(category.insertedAt);
  }

  static totalCategoryElement() {
    return new CategoryListElementResponse({
      categoryId: 0,
      categoryName: '전체',
      insertedAt: null,
      achievementCount: 0,
    });
  }

  static build(
    categoryMetaData: CategoryMetaData[],
  ): CategoryListElementResponse[] {
    const totalItem = CategoryListElementResponse.totalCategoryElement();
    const categories: CategoryListElementResponse[] = [];
    categories.push(totalItem);

    categoryMetaData?.forEach((category) => {
      if (
        !totalItem.lastChallenged ||
        new Date(totalItem.lastChallenged) < category.insertedAt
      )
        totalItem.lastChallenged = dateFormat(category.insertedAt);
      totalItem.continued += category.achievementCount;

      categories.push(new CategoryListElementResponse(category));
    });

    return categories;
  }
}
