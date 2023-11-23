import { File, UploadFile } from './index';
import { UuidHolder } from '../uuid-holder';

export abstract class FileStore {
  abstract upload(file: File): Promise<UploadFile>;
  abstract delete(filepath: string): Promise<void>;

  protected constructor(private readonly uuidHolder: UuidHolder) {}

  protected createStoreFileName(originalFilename: string) {
    const ext = this.extractExt(originalFilename);
    const randomName = this.uuidHolder.uuid();
    return `${randomName}.${ext}`;
  }

  private extractExt(originalFilename: string) {
    const pos: number = originalFilename.lastIndexOf('.');
    return originalFilename.substring(pos + 1);
  }
}
