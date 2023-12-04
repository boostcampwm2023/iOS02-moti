import { INestApplication } from '@nestjs/common';
import { AppleLoginRequest } from '../../src/auth/dto/apple-login-request.dto';
import * as request from 'supertest';
import { RefreshAuthRequestDto } from '../../src/auth/dto/refresh-auth-request.dto';
import { AppleLoginResponse } from '../../src/auth/dto/apple-login-response.dto';

export class AcceptanceAuthFixture {
  private static readonly identityToken =
    'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL2FwcGxlaWQuYXBwbGUuY29tIiwiYXVkIjoiY29tLm1vdGltYXRlLm1vdGkiLCJleHAiOjE4OTk2OTkzMjAsImlhdCI6MTY5OTYxMjczMiwic3ViIjoiMDAwODQ4LjEyNTU5ZWUxNTkyYjQ0YWY5NzA1ZmRhYmYyOGFlMzhiLjEyMzQiLCJjX2hhc2giOiJxSkd3ZEhyNEZYb055Qllobm5vQ21RIiwiYXV0aF90aW1lIjoxNjk5NjEyNzMyLCJub25jZV9zdXBwb3J0ZWQiOnRydWV9.GEappGPZxz0QLo7SaBVQbVS6hkouREaJICfernN8WqrqY0LQ4v3y0I9FAZNXFggZpDmrycDKXZiEm0a1tGNbOuL8mquahw7fy2pw3khAFh5RQY_FAYRnyJU8_R3Xt-z973rNumcpYiWfFACDyb26eJi2iWa7HHsQDoPuUcOXi-Y4_h5NQZoviL9HiLV5IjWggLsu4kyZ777yVBVF80XyAfvQtfzO6v62kGaGs9NfoAcag3w2XumON6L8HTOz9Q5F7hcSP91vvmeQHTICiwRO30xMHzY7hX52HukohoTkqKr3-MFoa3rMY-v6p5XsXs5bLj53ErS-pKK9QhtpsC4dGg';
  private static readonly identifier =
    '000848.12559ee1592b44af9705fdabf28ae38b.1234';
  private readonly basePath = '/api/v1/auth';
  private readonly app: INestApplication;

  constructor(app: INestApplication) {
    this.app = app;
  }

  static getIdentityTokenFromAppleLogin() {
    return this.identityToken;
  }

  async 애플_로그인을_한다(identityToken: string) {
    // AppleLoginResponse
    const response = await request(this.app.getHttpServer())
      .post(`${this.basePath}/login`)
      .send(new AppleLoginRequest(identityToken));

    return response;
  }

  async 애플_로그인을_하고_액세스_토큰과_리프레시_토큰을_반환한다() {
    const response = await request(this.app.getHttpServer())
      .post(`${this.basePath}/login`)
      .send(new AppleLoginRequest(AcceptanceAuthFixture.identityToken));

    return response.body.data as AppleLoginResponse;
  }

  async 리프레시_토큰을_이용해서_액세스_토큰을_재발급_받는다(
    accessToken: string,
    refreshAuthRequest: RefreshAuthRequestDto,
  ) {
    //RefreshAuthResponseDto
    const response = await request(this.app.getHttpServer())
      .post(`${this.basePath}/refresh`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send(refreshAuthRequest);

    return response;
  }
}
