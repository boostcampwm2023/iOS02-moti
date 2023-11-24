import { CategoryMetaData } from './category-metadata';
import { ApiProperty } from '@nestjs/swagger';
import { CategoryListElementResponse } from './category-list-element.response';
import { dateFormat } from '../../common/utils/date-formatter';

interface CategoryLegacyList {
  [key: string]: CategoryListElementResponse;
}

export class CategoryListLegacyResponse {
  @ApiProperty({ description: '카테고리 키 리스트' })
  categoryNames: string[] = [];
  categories: CategoryLegacyList = {};

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
        totalItem.lastChallenged = dateFormat(category.insertedAt);
      totalItem.continued += category.achievementCount;

      this.categories[category.categoryName] = new CategoryListElementResponse(
        category,
      );
    });
  }
}
