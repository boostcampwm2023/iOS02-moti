import { Module } from '@nestjs/common';
import { CustomTypeOrmModule } from '../config/typeorm/custom-typeorm.module';
import { ImageRepository } from './entities/image.repository';
import { FileStoreModule } from '../common/application/file-store/file-store.module';
import { ImageService } from './application/image.service';
import { ImageController } from './controller/image.controller';

@Module({
  imports: [
    CustomTypeOrmModule.forCustomRepository([ImageRepository]),
    FileStoreModule,
  ],
  controllers: [ImageController],
  providers: [ImageService],
})
export class ImageModule {}
