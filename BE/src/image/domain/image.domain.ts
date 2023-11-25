import { Achievement } from '../../achievement/domain/achievement.domain';
import { User } from '../../users/domain/user.domain';

export class Image {
  id: string;
  user: User;
  originalName: string;
  imageUrl: string;
  thumbnailUrl: string;
  achievement: Achievement;

  constructor(user: User, originalName: string, imageUrl: string) {
    this.user = user;
    this.originalName = originalName;
    this.imageUrl = imageUrl;
  }
}
