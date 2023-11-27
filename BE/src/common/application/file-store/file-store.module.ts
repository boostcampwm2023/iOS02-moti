import { Module } from '@nestjs/common';
import { FileStore } from './file-store';
import { fileStoreProviderOptions } from './file-store-provider-options';
import { UuidHolderModule } from '../uuid-holder/uuid.module';

@Module({
  providers: [fileStoreProviderOptions],
  imports: [UuidHolderModule],
  exports: [FileStore],
})
export class FileStoreModule {}
