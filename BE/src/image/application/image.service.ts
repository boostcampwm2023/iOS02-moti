import { Injectable } from '@nestjs/common';
import { ImageRepository } from '../entities/image.repository';
import { File, FileStore } from '../../common/application/file-store';
import { User } from '../../users/domain/user.domain';
import { Image } from '../domain/image.domain';
import { ConfigService } from '@nestjs/config';
import { Transactional } from '../../config/transaction-manager';
import { ImageNotFoundException } from '../exception/image-not-found.exception';
import { ImageAlreadyExistsThumbnailException } from '../exception/image-already-exists-thumbnail.exception';

@Injectable()
export class ImageService {
  private readonly imagePrefix: string;
  constructor(
    private readonly imageRepository: ImageRepository,
    private readonly fileStore: FileStore,
    configService: ConfigService,
  ) {
    this.imagePrefix = configService.get<string>('FILESTORE_IMAGE_PREFIX');
  }

  @Transactional()
  async saveImage(file: File, user: User): Promise<Image> {
    const image = new Image(user);
    await image.uploadOriginalImage(file, this.fileStore, this.imagePrefix);
    return await this.imageRepository.saveImage(image);
  }

  @Transactional()
  async saveThumbnail(imageId: string, thumbnailPath: string): Promise<Image> {
    const findImage = await this.imageRepository.findByImageKey(imageId);
    if (!findImage) throw new ImageNotFoundException();
    if (findImage.thumbnailUrl)
      throw new ImageAlreadyExistsThumbnailException();

    findImage.updateThumbnail(thumbnailPath);
    return await this.imageRepository.saveImage(findImage);
  }
}
