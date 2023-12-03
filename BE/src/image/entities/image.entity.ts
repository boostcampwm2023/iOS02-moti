import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AchievementEntity } from '../../achievement/entities/achievement.entity';
import { Image } from '../domain/image.domain';
import { UserEntity } from '../../users/entities/user.entity';
import { isNullOrUndefined } from '../../common/utils/is-null-or-undefined';

@Entity({ name: 'image' })
export class ImageEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: UserEntity;

  @Column({ type: 'varchar', length: 255 })
  originalName: string;

  @Column({ type: 'varchar', length: 200 })
  imageUrl: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  thumbnailUrl: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  imageKey: string;

  @Index()
  @OneToOne(() => AchievementEntity, { nullable: true })
  @JoinColumn({ name: 'achievement_id', referencedColumnName: 'id' })
  achievement: AchievementEntity;

  static from(image: Image): ImageEntity {
    if (isNullOrUndefined(image)) return image;

    const imageEntity = new ImageEntity();
    imageEntity.id = image.id;
    imageEntity.originalName = image.originalName;
    imageEntity.imageUrl = image.imageUrl;
    imageEntity.thumbnailUrl = image.thumbnailUrl;
    imageEntity.imageKey = image.imageKey;
    imageEntity.achievement = AchievementEntity.strictFrom(image.achievement);
    imageEntity.user = UserEntity.from(image.user);
    return imageEntity;
  }

  static strictFrom(image: Image): ImageEntity {
    if (isNullOrUndefined(image)) return image;

    const imageEntity = new ImageEntity();
    imageEntity.id = image.id;
    imageEntity.originalName = image.originalName;
    imageEntity.imageUrl = image.imageUrl;
    imageEntity.thumbnailUrl = image.thumbnailUrl;
    imageEntity.imageKey = image.imageKey;
    imageEntity.user = UserEntity.from(image.user);
    return imageEntity;
  }

  toModel(): Image {
    const image = new Image(this.user?.toModel());
    image.originalName = this.originalName;
    image.imageUrl = this.imageUrl;
    image.id = this.id;
    image.achievement = this.achievement?.toModel();
    image.user = this.user?.toModel();
    image.thumbnailUrl = this.thumbnailUrl;
    image.imageKey = this.imageKey;
    return image;
  }
}
