import { Image } from '../domain/image.domain';
import { ApiProperty } from '@nestjs/swagger';

export class ImageResponse {
  @ApiProperty({ description: '이미지 아이디' })
  id: number;
  @ApiProperty({ description: '저장된 이미지 URL' })
  imageUrl: string;

  constructor(id: number, imageUrl: string) {
    this.id = id;
    this.imageUrl = imageUrl;
  }

  static from(image: Image): ImageResponse {
    return new ImageResponse(image.id, image.imageUrl);
  }
}
