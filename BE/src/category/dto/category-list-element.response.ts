import { CategoryMetaData } from './category-metadata';
import { dateFormat } from '../../common/utils/date-formatter';
import { ApiProperty } from '@nestjs/swagger';

export class CategoryListElementResponse {
  @ApiProperty({ description: 'id' })
  id: number;
  @ApiProperty({ description: 'name' })
  name: string;
  @ApiProperty({ description: 'continued' })
  continued: number;
  @ApiProperty({
    description: 'lastChallenged',
    example: '2023-11-23T15:35:26Z',
  })
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

  static notAssignedCategoryElement() {
    return new CategoryListElementResponse({
      categoryId: -1,
      categoryName: '미설정',
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

    if (categoryMetaData.length === 0 || categoryMetaData[0].categoryId !== -1)
      categories.push(CategoryListElementResponse.notAssignedCategoryElement());

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
