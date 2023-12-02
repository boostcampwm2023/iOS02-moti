import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { ThumbnailRequest } from '../../src/image/dto/thumbnail-request';
import { File } from '../../src/common/application/file-store';

export class AcceptanceImageFixture {
  private readonly basePath = '/api/v1/image';
  private readonly app: INestApplication;

  constructor(app: INestApplication) {
    this.app = app;
  }
  async 이미지를_업로드_한다(accessToken: string, image: File) {
    // ImageResponse
    const response = await request(this.app.getHttpServer())
      .post(this.basePath)
      .set('Authorization', `Bearer ${accessToken}`)
      .send(image);

    return response;
  }

  async 썸네일을_업데이트_한다(
    accessToken: string,
    imageId: string,
    thumbnail: ThumbnailRequest,
  ) {
    const response = await request(this.app.getHttpServer())
      .post(`${this.basePath}/${imageId}/thumbnails`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send(thumbnail);

    return response;
  }
}
