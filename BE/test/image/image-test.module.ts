import { Module } from '@nestjs/common';
import { CustomTypeOrmModule } from '../../src/config/typeorm/custom-typeorm.module';
import { ImageRepository } from '../../src/image/entities/image.repository';
import { ImageModule } from '../../src/image/image.module';
import { ImageFixture } from './image-fixture';
import { FileStoreModule } from '../../src/common/application/file-store/file-store.module';

@Module({
  imports: [
    CustomTypeOrmModule.forCustomRepository([ImageRepository]),
    ImageModule,
    FileStoreModule,
  ],
  providers: [ImageFixture],
  exports: [ImageFixture],
})
export class ImageTestModule {}
