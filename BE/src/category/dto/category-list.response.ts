import { CategoryMetaData } from './category-metadata';
import { ApiProperty } from '@nestjs/swagger';

interface CategoryList {
  [key: string]: CategoryListElementResponse;
}

export class CategoryListResponse {
  @ApiProperty({ description: '카테고리 키 리스트' })
  categoryNames: string[] = [];
  @ApiProperty({ description: '카테고리 데이터' })
  categories: CategoryList = {};

  constructor(categoryMetaData: CategoryMetaData[]) {
    categoryMetaData = categoryMetaData || [];
    const totalItem = CategoryListElementResponse.totalCategoryElement();
    this.categories[totalItem.name] = totalItem;
    this.categoryNames.push(totalItem.name);
    categoryMetaData?.forEach((category) => {
      this.categoryNames.push(category.categoryName);

      if (
        !totalItem.lastChallenged ||
        new Date(totalItem.lastChallenged) < category.insertedAt
      )
        totalItem.lastChallenged = category.insertedAt.toISOString();
      totalItem.continued += category.achievementCount;

      this.categories[category.categoryName] = new CategoryListElementResponse(
        category,
      );
    });
  }
}

export class CategoryListElementResponse {
  id: number;
  name: string;
  continued: number;
  lastChallenged: string;

  constructor(category: CategoryMetaData) {
    this.id = category.categoryId;
    this.name = category.categoryName;
    this.continued = category.achievementCount;
    this.lastChallenged = category.insertedAt?.toISOString() || null;
  }

  static totalCategoryElement() {
    return new CategoryListElementResponse({
      categoryId: 0,
      categoryName: '전체',
      insertedAt: null,
      achievementCount: 0,
    });
  }
}
