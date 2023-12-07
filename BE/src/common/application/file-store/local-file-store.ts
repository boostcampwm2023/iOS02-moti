import { ConfigService } from '@nestjs/config';
import * as path from 'path';
import * as fs from 'fs/promises';
import { Injectable } from '@nestjs/common';
import { File, FileStore, StoreOptions, UploadFile } from './index';
import { UuidHolder } from '../uuid-holder';
import { FailFileTaskException } from './fail-file-task.exception';
import * as process from 'process';

@Injectable()
export class LocalFileStore extends FileStore {
  private readonly basepath: string;
  constructor(uuidHolder: UuidHolder, configService: ConfigService) {
    super(uuidHolder);
    this.basepath = configService.get('FILESTORE_PREFIX');
  }

  async delete(filename: string, storeOptions?: StoreOptions): Promise<void> {
    try {
      await fs.unlink(this.getFullPath(filename, storeOptions));
    } catch (e) {
      throw new FailFileTaskException();
    }
  }

  async upload(file: File, storeOptions?: StoreOptions): Promise<UploadFile> {
    const originalFilename = file.originalname;
    const { filename, fileId } = this.createStoreFileName(originalFilename);
    const fullPath = this.getFullPath(filename, storeOptions);
    const callableFullPath = `file://${fullPath}`;

    try {
      await fs.mkdir(path.dirname(fullPath), { recursive: true });
      await fs.writeFile(fullPath, file.buffer);
    } catch (e) {
      throw new FailFileTaskException();
    }

    return {
      uploadFileName: filename,
      originalFileName: originalFilename,
      uploadFullPath: callableFullPath,
      fileKey: fileId,
    };
  }

  private getFullPath(filename: string, storeOptions: StoreOptions) {
    return path.join(
      process.cwd(),
      storeOptions?.prefix || this.basepath,
      storeOptions?.basePath || '',
      filename,
    );
  }
}
