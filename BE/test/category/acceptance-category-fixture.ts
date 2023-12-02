import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { CategoryCreate } from '../../src/category/dto/category-create';

export class AcceptanceCategoryFixture {
  private readonly basePath = '/api/v1/categories';
  private readonly app: INestApplication;

  constructor(app: INestApplication) {
    this.app = app;
  }
  async 카테고리를_생성한다(
    accessToken: string,
    categoryCreate: CategoryCreate,
  ) {
    // CategoryResponse
    const response = await request(this.app.getHttpServer())
      .post(this.basePath)
      .set('Authorization', `Bearer ${accessToken}`)
      .send(categoryCreate);

    return response;
  }

  async 카테고리_리스트를_조회한다(accessToken: string) {
    //CategoryListElementResponse[]
    const response = await request(this.app.getHttpServer())
      .get(this.basePath)
      .set('Authorization', `Bearer ${accessToken}`)
      .send();

    return response;
  }
}
