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
    this.basepath = configService.get('LOCAL_BASEPATH');
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
    const storeFileName = this.createStoreFileName(originalFilename);
    const fullPath = this.getFullPath(storeFileName, storeOptions);
    const callableFullPath = `file://${fullPath}`;

    try {
      await fs.mkdir(path.dirname(fullPath), { recursive: true });
      await fs.writeFile(fullPath, file.buffer);
    } catch (e) {
      throw new FailFileTaskException();
    }

    return {
      uploadFileName: storeFileName,
      originalFileName: originalFilename,
      uploadFullPath: callableFullPath,
    };
  }

  private getFullPath(filename: string, storeOptions: StoreOptions) {
    return path.join(
      process.cwd(),
      this.basepath,
      storeOptions?.prefix || '',
      storeOptions?.basePath || '',
      filename,
    );
  }
}
