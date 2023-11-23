import { Module } from '@nestjs/common';
import { LocalFileStore } from './local-file-store';

@Module({
  exports: [LocalFileStore],
  providers: [LocalFileStore],
})
export class FileStoreModule {}
