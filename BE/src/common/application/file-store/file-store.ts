import { File, StoredFile, UploadFile } from './index';
import { UuidHolder } from '../uuid-holder';

export interface StoreOptions {
  prefix?: string;
  basePath?: string;
}

export abstract class FileStore {
  /**
   * Upload file to file store
   * @param file - file to upload
   * @param storeOptions - options for file store
   */
  abstract upload(file: File, storeOptions?: StoreOptions): Promise<UploadFile>;

  /**
   * Delete file from file store
   * @param filename - filename to delete, not a fileFullPath!!!!
   * @param StoreOptions - options for file store
   */
  abstract delete(filename: string, StoreOptions?: StoreOptions): Promise<void>;

  protected constructor(private readonly uuidHolder: UuidHolder) {}

  protected createStoreFileName(originalFilename: string): StoredFile {
    const ext = this.extractExt(originalFilename);
    const randomName = this.uuidHolder.uuid();
    return {
      filename: `${randomName}.${ext}`,
      fileId: randomName,
    };
  }

  private extractExt(originalFilename: string) {
    const pos: number = originalFilename.lastIndexOf('.');
    return originalFilename.substring(pos + 1);
  }
}
