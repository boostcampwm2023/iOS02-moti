import { UserRole } from './user-role';
import { Category } from '../../category/domain/category.domain';

export class User {
  id: number;

  avatarUrl: string;

  userCode: string;

  userIdentifier: string;

  roles: UserRole[] = [UserRole.MEMBER];

  categorySequence: number;

  categoryCount: number;

  static from(userIdentifier: string) {
    const user = new User();
    user.userIdentifier = userIdentifier;
    return user;
  }

  assignUserCode(userCode: string) {
    this.userCode = userCode;
  }

  assignAvatar(avatarUrl: string) {
    this.avatarUrl = avatarUrl;
  }

  clearRelations() {
    this.roles = undefined;
  }

  newCategory(categoryName: string): Category {
    ++this.categoryCount;
    return new Category(this, categoryName, ++this.categorySequence);
  }
}
