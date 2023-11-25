import { Achievement } from '../../achievement/domain/achievement.domain';
import { User } from '../../users/domain/user.domain';
import { UploadFile } from '../../common/application/file-store';

export class Image {
  id: number;
  user: User;
  originalName: string;
  imageUrl: string;
  thumbnailUrl: string = null;
  achievement: Achievement;

  constructor(user: User, originalName: string, imageUrl: string) {
    this.user = user;
    this.originalName = originalName;
    this.imageUrl = imageUrl;
  }

  static from(image: UploadFile, user: User): Image {
    return new Image(user, image.originalFileName, image.uploadFullPath);
  }
}
