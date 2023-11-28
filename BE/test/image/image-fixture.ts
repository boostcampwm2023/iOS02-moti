import { Injectable } from '@nestjs/common';
import { User } from '../../src/users/domain/user.domain';
import { ImageRepository } from '../../src/image/entities/image.repository';
import { Image } from '../../src/image/domain/image.domain';
import { FileFixture } from '../common/file-store/file-fixture';
import { FileStore } from '../../src/common/application/file-store';

@Injectable()
export class ImageFixture {
  static id = 0;

  constructor(
    private readonly imageRepository: ImageRepository,
    private readonly fileStore: FileStore,
  ) {}

  async getImage(
    user: User,
    imageUrl?: string,
    thumbnailUrl?: string,
  ): Promise<Image> {
    const image = ImageFixture.image(user, imageUrl, thumbnailUrl);
    return this.imageRepository.saveImage(image);
  }

  async getImageWithRealFile(user: User, imagePrefix: string): Promise<Image> {
    const image = ImageFixture.image(user);
    const file = FileFixture.file(`test${++ImageFixture.id}`, 'jpg');
    await image.uploadOriginalImage(file, this.fileStore, imagePrefix);
    return this.imageRepository.saveImage(image);
  }

  static image(user: User, imageUrl?: string, thumbnailUrl?: string): Image {
    const image = new Image(user);
    image.updateThumbnail(thumbnailUrl || null);
    const file = FileFixture.file(`test${++ImageFixture.id}`, 'jpg');
    image.originalName = file.originalname;
    image.imageUrl = imageUrl || file.path;
    return image;
  }
}
