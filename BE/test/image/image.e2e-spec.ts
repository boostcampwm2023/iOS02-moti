import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { validationPipeOptions } from '../../src/config/validation';
import { UnexpectedExceptionFilter } from '../../src/common/filter/unexpected-exception.filter';
import { MotimateExceptionFilter } from '../../src/common/filter/exception.filter';
import { AuthFixture } from '../auth/auth-fixture';
import { AuthTestModule } from '../auth/auth-test.module';
import * as request from 'supertest';
import * as path from 'path';
import * as process from 'process';
import * as fs from 'fs/promises';

describe('Image Test (e2e)', () => {
  let app: INestApplication;
  let authFixture: AuthFixture;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, AuthTestModule],
    }).compile();

    authFixture = moduleFixture.get<AuthFixture>(AuthFixture);
    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(new ValidationPipe(validationPipeOptions));
    app.useGlobalFilters(
      new UnexpectedExceptionFilter(),
      new MotimateExceptionFilter(),
    );
    await app.init();
  });

  afterEach(async () => {
    await fs.rm(path.join(process.cwd(), '/serverless'), {
      recursive: true,
      force: true,
    });
  });

  describe('테스트 환경 확인', () => {
    it('app가 정의되어 있어야 한다.', () => {
      expect(app).toBeDefined();
    });
  });

  describe('saveImage는 이미지를 저장할 수 있다.', () => {
    it('이미지 저장에 성공하면 id와 imageURL을 포함한다.', async () => {
      const { accessToken } = await authFixture.getAuthenticatedUser('ABC');

      return request(app.getHttpServer())
        .post('/api/v1/images')
        .set('Authorization', `Bearer ${accessToken}`)
        .attach('image', path.join(process.cwd(), '/test/resources/img.png'))
        .expect(201)
        .expect((res: request.Response) => {
          expect(res.body.success).toBe(true);
          expect(res.body.data.id).toBeDefined();
          expect(res.body.data.id).toBeGreaterThanOrEqual(0);
          expect(res.body.data.imageUrl).toBeDefined();
        });
    });
  });
});
