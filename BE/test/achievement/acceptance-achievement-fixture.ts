import { INestApplication, Injectable } from '@nestjs/common';
import * as request from 'supertest';
import { PaginateAchievementRequest } from '../../src/achievement/dto/paginate-achievement-request';
import { AchievementCreateRequest } from '../../src/achievement/dto/achievement-create-request';

@Injectable()
export class AcceptanceAchievementFixture {
  private readonly basePath = '/api/v1/achievements';
  private readonly app: INestApplication;

  constructor(app: INestApplication) {
    this.app = app;
  }
  async 달성기록_리스트를_조회한다(
    accessToken: string,
    paginateAchievementRequest: PaginateAchievementRequest,
  ) {
    // PaginateAchievementResponse
    const response = await request(this.app.getHttpServer())
      .get(this.basePath)
      .set('Authorization', `Bearer ${accessToken}`)
      .send(paginateAchievementRequest);

    return response;
  }

  async 달성기록_상세정보를_조회한다(
    accessToken: string,
    achievementId: number,
  ) {
    //AchievementDetailResponse
    const response = await request(this.app.getHttpServer())
      .get(`${this.basePath}/${achievementId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send();

    return response;
  }

  async 달성기록을_삭제한다(accessToken: string, achievementId: number) {
    //AchievementDeleteResponse
    const response = await request(this.app.getHttpServer())
      .delete(`${this.basePath}/${achievementId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send();

    return response;
  }

  async 달성기록을_수정한다(accessToken: string, achievementId: number) {
    //AchievementUpdateResponse
    const response = await request(this.app.getHttpServer())
      .put(`${this.basePath}/${achievementId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send();

    return response;
  }

  async 달성기록을_생성한다(
    accessToken: string,
    achievementCreate: AchievementCreateRequest,
  ) {
    const response = await request(this.app.getHttpServer())
      .post(this.basePath)
      .set('Authorization', `Bearer ${accessToken}`)
      .send(achievementCreate);

    return response;
  }
}
