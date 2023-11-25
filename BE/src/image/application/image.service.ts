import { Injectable } from '@nestjs/common';
import { ImageRepository } from '../entities/image.repository';
import {
  File,
  FileStore,
  UploadFile,
} from '../../common/application/file-store';
import { User } from '../../users/domain/user.domain';
import { Image } from '../domain/image.domain';
import { ConfigService } from '@nestjs/config';

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

  async saveImage(file: File, user: User): Promise<Image> {
    const savedFile: UploadFile = await this.fileStore.upload(file, {
      prefix: this.imagePrefix,
    });
    const image = Image.from(savedFile, user);
    return await this.imageRepository.saveImage(image);
  }
}
