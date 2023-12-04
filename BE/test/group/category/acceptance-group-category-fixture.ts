import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { GroupCategoryCreate } from '../../../src/group/category/dto/group-category-create';

export class AcceptanceGroupCategoryFixture {
  private readonly basePath = '/api/v1/groups';
  private readonly app: INestApplication;

  constructor(app: INestApplication) {
    this.app = app;
  }
  async 그룹_카테고리를_생성한다(
    accessToken: string,
    groupId: number,
    groupCtgCreate: GroupCategoryCreate,
  ) {
    // GroupCategoryResponse
    const response = await request(this.app.getHttpServer())
      .post(`${this.basePath}/${groupId}/categories`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send(groupCtgCreate);

    return response;
  }
}
