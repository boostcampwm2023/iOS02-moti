import { CustomRepository } from '../../config/typeorm/custom-repository.decorator';
import { ImageEntity } from './image.entity';
import { TransactionalRepository } from '../../config/transaction-manager/transactional-repository';
import { Image } from '../domain/image.domain';

@CustomRepository(ImageEntity)
export class ImageRepository extends TransactionalRepository<ImageEntity> {
  async saveImage(image: Image): Promise<Image> {
    const imageEntity = ImageEntity.from(image);
    const savedImage = await this.repository.save(imageEntity);
    return savedImage.toModel();
  }
}
