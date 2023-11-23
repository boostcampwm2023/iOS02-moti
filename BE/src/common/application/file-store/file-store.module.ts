import { Module } from '@nestjs/common';
import { FileStore } from './file-store';
import { fileStoreProviderOptions } from './file-store-provider-options';

@Module({
  providers: [fileStoreProviderOptions],
  exports: [FileStore],
})
export class FileStoreModule {}
