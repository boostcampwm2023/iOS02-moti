import { FileStore } from './file-store';
import * as process from 'process';
import { LocalFileStore } from './local-file-store';
import { ObjectStorageFileStore } from './object-storage-file-store';

export const fileStoreProviderOptions = {
  provide: FileStore,
  useClass:
    process.env.NODE_ENV !== 'production'
      ? LocalFileStore
      : ObjectStorageFileStore,
};
