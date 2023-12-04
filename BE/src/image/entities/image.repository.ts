import { CustomRepository } from '../../config/typeorm/custom-repository.decorator';
import { ImageEntity } from './image.entity';
import { TransactionalRepository } from '../../config/transaction-manager/transactional-repository';
import { Image } from '../domain/image.domain';
import { User } from '../../users/domain/user.domain';
import { IsNull } from 'typeorm';

@CustomRepository(ImageEntity)
export class ImageRepository extends TransactionalRepository<ImageEntity> {
  async saveImage(image: Image): Promise<Image> {
    const imageEntity = ImageEntity.from(image);
    const savedImage = await this.repository.save(imageEntity);
    return savedImage.toModel();
  }

  async findById(id: number): Promise<Image> {
    const imageEntity = await this.repository.findOneBy({
      id: id,
    });

    return imageEntity?.toModel();
  }

  async findByIdAndUserAndNotAchievement(
    id: number,
    user: User,
  ): Promise<Image> {
    const imageEntity = await this.repository.findOneBy({
      id: id,
      user: {
        id: user.id,
      },
      achievement: IsNull(),
      groupAchievement: IsNull(),
    });

    return imageEntity?.toModel();
  }

  async findByImageKey(imageKey: string): Promise<Image> {
    const imageEntity = await this.repository.findOneBy({
      imageKey: imageKey,
    });

    return imageEntity?.toModel();
  }
}
