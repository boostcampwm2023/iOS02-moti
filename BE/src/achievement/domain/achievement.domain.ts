import { User } from '../../users/domain/user.domain';
import { Category } from '../../category/domain/category.domain';

export class Achievement {
  id: number;

  user: User;

  category: Category;

  title: string;

  content: string;

  imageUrl: string;

  thumbnailUrl: string;

  constructor(
    user: User,
    category: Category,
    title: string,
    content: string,
    imageUrl: string,
    thumbnailUrl: string,
  ) {
    this.user = user;
    this.category = category;
    this.title = title;
    this.content = content;
    this.imageUrl = imageUrl;
    this.thumbnailUrl = thumbnailUrl;
  }

  assignUser(user: User) {
    this.user = user;
  }

  assignCategory(category: Category) {
    this.category = category;
  }
}
