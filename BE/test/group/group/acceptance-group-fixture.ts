import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { CreateGroupRequest } from '../../../src/group/group/dto/create-group-request.dto';

export class AcceptanceGroupFixture {
  private readonly basePath = '/api/v1/groups';
  private readonly app: INestApplication;

  constructor(app: INestApplication) {
    this.app = app;
  }
  async 그룹을_생성한다(
    accessToken: string,
    createGroupRequest: CreateGroupRequest,
  ) {
    // GroupResponse
    const response = await request(this.app.getHttpServer())
      .post(this.basePath)
      .set('Authorization', `Bearer ${accessToken}`)
      .send(createGroupRequest);

    return response;
  }

  async 내가_속해_있는_그룹을_조회한다(accessToken: string) {
    //GroupListResponse
    const response = await request(this.app.getHttpServer())
      .get(this.basePath)
      .set('Authorization', `Bearer ${accessToken}`)
      .send();

    return response;
  }
}
