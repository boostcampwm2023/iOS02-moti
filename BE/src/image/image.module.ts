import { Module } from '@nestjs/common';
import { CustomTypeOrmModule } from '../config/typeorm/custom-typeorm.module';
import { ImageRepository } from './entities/image.repository';
import { FileStoreModule } from '../common/application/file-store/file-store.module';
import { ImageService } from './application/image.service';

@Module({
  imports: [
    CustomTypeOrmModule.forCustomRepository([ImageRepository]),
    FileStoreModule,
  ],
  controllers: [],
  providers: [],
})
export class ImageModule {}
