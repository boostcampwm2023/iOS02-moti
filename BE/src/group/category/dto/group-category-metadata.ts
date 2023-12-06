import { CategoryMetaData } from '../../../category/dto/category-metadata';
import { IGroupCategoryMetaData } from '../index';

export class GroupCategoryMetadata extends CategoryMetaData {
  constructor(groupCategoryMetaData: IGroupCategoryMetaData) {
    super(groupCategoryMetaData);
  }
}
