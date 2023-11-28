import { User } from '../../users/domain/user.domain';
import { Category } from '../../category/domain/category.domain';
import { AchievementUpdate } from '../index';
import { Image } from '../../image/domain/image.domain';

export class Achievement {
  id: number;

  user: User;

  category: Category;

  title: string;

  content: string;

  image: Image;

  constructor(
    user: User,
    category: Category,
    title: string,
    content: string,
    image: Image,
  ) {
    this.user = user;
    this.category = category;
    this.title = title;
    this.content = content;
    this.image = image;
  }

  update(achievementUpdate: AchievementUpdate) {
    this.title = achievementUpdate.title || this.title;
    this.content = achievementUpdate.content || this.content;
    this.category = achievementUpdate.category || this.category;
  }
}
