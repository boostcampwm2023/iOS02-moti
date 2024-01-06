import { UserRole } from './user-role';
import { Category } from '../../category/domain/category.domain';
import { Group } from '../../group/group/domain/group.domain';
import { UserGroup } from '../../group/group/domain/user-group.doamin';
import { UserGroupGrade } from '../../group/group/domain/user-group-grade';

export class User {
  id: number;

  avatarUrl: string;

  userCode: string;

  userIdentifier: string;

  roles: UserRole[] = [UserRole.MEMBER];

  categorySequence: number;

  categoryCount: number;

  groupCount: number;

  groupSequence: number;

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

  joinGroup(group: Group): UserGroup {
    ++this.groupCount;
    return new UserGroup(
      this,
      group,
      UserGroupGrade.PARTICIPANT,
      ++this.groupSequence,
    );
  }

  leaveGroup() {
    --this.groupCount;
  }

  deleteCategory() {
    this.categoryCount--;
  }
}
