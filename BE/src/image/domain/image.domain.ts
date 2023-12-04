import { Achievement } from '../../achievement/domain/achievement.domain';
import { User } from '../../users/domain/user.domain';
import { FileStore, UploadFile } from '../../common/application/file-store';
import { File } from '../../common/application/file-store';
import { GroupAchievement } from '../../group/achievement/domain/group-achievement.domain';

export class Image {
  id: number;
  user: User;
  originalName: string;
  imageUrl: string;
  thumbnailUrl: string = null;
  imageKey: string;
  achievement: Achievement;
  groupAchievement: GroupAchievement;

  async uploadOriginalImage(
    file: File,
    fileStore: FileStore,
    fileStorePrefix: string,
  ): Promise<UploadFile> {
    const uploadFile = await fileStore.upload(file, {
      prefix: fileStorePrefix,
    });
    this.originalName = uploadFile.originalFileName;
    this.imageUrl = uploadFile.uploadFullPath;
    this.imageKey = uploadFile.fileKey;

    return uploadFile;
  }

  updateThumbnail(thumbnailUrl: string) {
    this.thumbnailUrl = thumbnailUrl;
  }

  constructor(user: User) {
    this.user = user;
  }
}
