import { ConfigService } from '@nestjs/config';
import * as path from 'path';
import * as fs from 'fs/promises';
import { Injectable } from '@nestjs/common';
import { File, FileStore, UploadFile } from './index';
import { UuidHolder } from '../uuid-holder';
import { FailFileTaskException } from './fail-file-task.exception';

@Injectable()
export class LocalFileStore extends FileStore {
  private readonly basepath: string;
  constructor(uuidHolder: UuidHolder, configService: ConfigService) {
    super(uuidHolder);
    this.basepath = configService.get('LOCAL_BASEPATH');
  }

  async delete(fileUrl: string): Promise<void> {
    try {
      await fs.unlink(fileUrl);
    } catch (e) {
      throw new FailFileTaskException();
    }
  }

  async upload(file: File): Promise<UploadFile> {
    const originalFilename = file.originalname;
    const storeFileName = this.createStoreFileName(originalFilename);
    const fullPath = this.getFullPath(storeFileName);

    try {
      await fs.mkdir(path.dirname(fullPath), { recursive: true });
      await fs.writeFile(fullPath, file.buffer);
    } catch (e) {
      throw new FailFileTaskException();
    }

    return {
      uploadFileName: storeFileName,
      originalFileName: originalFilename,
      uploadFullPath: fullPath,
    };
  }

  private getFullPath(filename: string) {
    return path.join(this.basepath, filename);
  }
}
