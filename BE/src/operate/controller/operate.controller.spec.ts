import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AuthFixture } from '../../../test/auth/auth-fixture';
import { anyOfClass, instance, mock, when } from 'ts-mockito';
import { AppModule } from '../../app.module';
import { AuthTestModule } from '../../../test/auth/auth-test.module';
import { Test, TestingModule } from '@nestjs/testing';
import { validationPipeOptions } from '../../config/validation';
import { UnexpectedExceptionFilter } from '../../common/filter/unexpected-exception.filter';
import { MotimateExceptionFilter } from '../../common/filter/exception.filter';
import * as request from 'supertest';
import { OperateService } from '../application/operate.service';
import { MotiPolicyCreate } from '../dto/moti-policy-create';
import { MotiPolicy } from '../domain/moti-policy.domain';
import { PolicyAlreadyExistsException } from '../exception/policy-already-exists.exception';
import { transactionTest } from '../../../test/common/transaction-test';
import { DataSource } from 'typeorm';
import { MotiPolicyIdempotentUpdate } from '../dto/moti-policy-idempotent-update';
import { PolicyNotFoundException } from '../exception/policy-not-found.exception';
import { MotiPolicyPartialUpdate } from '../dto/moti-policy-partitial-update';

describe('UserController Test', () => {
  let app: INestApplication;
  let authFixture: AuthFixture;
  let mockOperateService: OperateService;
  let dataSource: DataSource;

  beforeAll(async () => {
    mockOperateService = mock<OperateService>(OperateService);

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, AuthTestModule],
      controllers: [],
      providers: [],
    })
      .overrideProvider(OperateService)
      .useValue(instance<OperateService>(mockOperateService))
      .compile();

    authFixture = moduleFixture.get<AuthFixture>(AuthFixture);
    dataSource = moduleFixture.get<DataSource>(DataSource);
    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(new ValidationPipe(validationPipeOptions));
    app.useGlobalFilters(
      new UnexpectedExceptionFilter(),
      new MotimateExceptionFilter(),
    );

    await app.init();
  });

  describe('테스트 환경 확인', () => {
    it('app가 정의되어 있어야 한다.', () => {
      expect(app).toBeDefined();
    });
  });

  describe('initPolicy는 운영정책을 초기화할 수 있다.', () => {
    it('성공 시 200을 반환한다.', async () => {
      await transactionTest(dataSource, async () => {
        // given
        const { accessToken } = await authFixture.getAuthenticatedAdmin('ABC');

        const motiPolicy = new MotiPolicy(
          '0.0.1',
          '0.0.1',
          'https://wwww.a.b.com/policy',
        );

        when(
          mockOperateService.initMotiPolicy(anyOfClass(MotiPolicyCreate)),
        ).thenResolve(motiPolicy);

        // when
        // then
        return request(app.getHttpServer())
          .post('/api/v1/operate/policy')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({
            latest: '0.0.1',
            required: '0.0.1',
            privacyPolicy: 'https://wwww.a.b.com/policy',
          })
          .expect(201)
          .expect((res: request.Response) => {
            expect(res.body.success).toEqual(true);
            expect(res.body.data).toEqual({
              latest: '0.0.1',
              required: '0.0.1',
              privacyPolicy: 'https://wwww.a.b.com/policy',
            });
          });
      });
    });

    it('어드민 계정이 아니라면 초기화할 수 없다.', async () => {
      await transactionTest(dataSource, async () => {
        // given
        const { accessToken } = await authFixture.getAuthenticatedUser('ABC');

        // when
        // then
        return request(app.getHttpServer())
          .post('/api/v1/operate/policy')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({
            latest: '0.0.1',
            required: '0.0.1',
            privacyPolicy: 'https://wwww.a.b.com/policy',
          })
          .expect(403)
          .expect((res: request.Response) => {
            expect(res.body.success).toEqual(false);
            expect(res.body.message).toEqual('제한된 요청입니다.');
          });
      });
    });

    it('이미 초기화된 경우 500을 반환한다.', async () => {
      await transactionTest(dataSource, async () => {
        // given
        const { accessToken } = await authFixture.getAuthenticatedAdmin('ABC');

        when(
          mockOperateService.initMotiPolicy(anyOfClass(MotiPolicyCreate)),
        ).thenThrow(new PolicyAlreadyExistsException());

        // when
        // then
        return request(app.getHttpServer())
          .post('/api/v1/operate/policy')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({
            latest: '0.0.1',
            required: '0.0.1',
            privacyPolicy: 'https://wwww.a.b.com/policy',
          })
          .expect(500)
          .expect((res: request.Response) => {
            expect(res.body.success).toEqual(false);
            expect(res.body.message).toEqual(
              '이미 초기화된 모티메이트 운영정책입니다.',
            );
          });
      });
    });

    it('잘못된 인증시 401을 반환한다.', async () => {
      // given
      const accessToken = 'abcd.abcd.efgh';

      // when
      // then
      return request(app.getHttpServer())
        .post('/api/v1/operate/policy')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          latest: '0.0.1',
          required: '0.0.1',
          privacyPolicy: 'https://wwww.a.b.com/policy',
        })
        .expect(401)
        .expect((res: request.Response) => {
          expect(res.body.success).toBe(false);
          expect(res.body.message).toBe('잘못된 토큰입니다.');
        });
    });

    it('만료된 인증정보에 401을 반환한다.', async () => {
      // given
      const { accessToken } =
        await authFixture.getExpiredAccessTokenUser('ABC');

      // when
      // then
      return request(app.getHttpServer())
        .post('/api/v1/operate/policy')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          latest: '0.0.1',
          required: '0.0.1',
          privacyPolicy: 'https://wwww.a.b.com/policy',
        })
        .expect(401)
        .expect((res: request.Response) => {
          expect(res.body.success).toBe(false);
          expect(res.body.message).toBe('만료된 토큰입니다.');
        });
    });
  });

  describe('운영정책을 업데이트할 수 있다.', () => {
    it('성공 시 200을 반환한다.', async () => {
      await transactionTest(dataSource, async () => {
        // given
        const { accessToken } = await authFixture.getAuthenticatedAdmin('ABC');

        const motiPolicy = new MotiPolicy(
          '0.0.1',
          '0.0.1',
          'https://wwww.a.b.com/policy',
        );

        when(
          mockOperateService.updateMotiPolicy(
            anyOfClass(MotiPolicyIdempotentUpdate),
          ),
        ).thenResolve(motiPolicy);

        // when
        // then
        return request(app.getHttpServer())
          .put('/api/v1/operate/policy')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({
            latest: '0.0.1',
            required: '0.0.1',
            privacyPolicy: 'https://wwww.a.b.com/policy',
          })
          .expect(200)
          .expect((res: request.Response) => {
            expect(res.body.success).toEqual(true);
            expect(res.body.data).toEqual({
              latest: '0.0.1',
              required: '0.0.1',
              privacyPolicy: 'https://wwww.a.b.com/policy',
            });
          });
      });
    });

    it('성공 시 200을 반환한다.', async () => {
      await transactionTest(dataSource, async () => {
        // given
        const { accessToken } = await authFixture.getAuthenticatedAdmin('ABC');

        const motiPolicy = new MotiPolicy(
          '0.0.2',
          '0.0.1',
          'https://wwww.a.b.com/policy',
        );

        when(
          mockOperateService.updateMotiPolicy(
            anyOfClass(MotiPolicyPartialUpdate),
          ),
        ).thenResolve(motiPolicy);

        // when
        // then
        return request(app.getHttpServer())
          .patch('/api/v1/operate/policy')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({
            latest: '0.0.2',
          })
          .expect(200)
          .expect((res: request.Response) => {
            expect(res.body.success).toEqual(true);
            expect(res.body.data).toEqual({
              latest: '0.0.2',
              required: '0.0.1',
              privacyPolicy: 'https://wwww.a.b.com/policy',
            });
          });
      });
    });

    it('어드민 계정이 아니라면 초기화할 수 없다.', async () => {
      await transactionTest(dataSource, async () => {
        // given
        const { accessToken } = await authFixture.getAuthenticatedUser('ABC');

        // when
        // then
        return request(app.getHttpServer())
          .put('/api/v1/operate/policy')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({
            latest: '0.0.1',
            required: '0.0.1',
            privacyPolicy: 'https://wwww.a.b.com/policy',
          })
          .expect(403)
          .expect((res: request.Response) => {
            expect(res.body.success).toEqual(false);
            expect(res.body.message).toEqual('제한된 요청입니다.');
          });
      });
    });

    it('잘못된 인증시 401을 반환한다.', async () => {
      // given
      const accessToken = 'abcd.abcd.efgh';

      // when
      // then
      return request(app.getHttpServer())
        .put('/api/v1/operate/policy')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          latest: '0.0.1',
          required: '0.0.1',
          privacyPolicy: 'https://wwww.a.b.com/policy',
        })
        .expect(401)
        .expect((res: request.Response) => {
          expect(res.body.success).toBe(false);
          expect(res.body.message).toBe('잘못된 토큰입니다.');
        });
    });

    it('만료된 인증정보에 401을 반환한다.', async () => {
      // given
      const { accessToken } =
        await authFixture.getExpiredAccessTokenUser('ABC');

      // when
      // then
      return request(app.getHttpServer())
        .put('/api/v1/operate/policy')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          latest: '0.0.1',
          required: '0.0.1',
          privacyPolicy: 'https://wwww.a.b.com/policy',
        })
        .expect(401)
        .expect((res: request.Response) => {
          expect(res.body.success).toBe(false);
          expect(res.body.message).toBe('만료된 토큰입니다.');
        });
    });
  });

  describe('getPolicy는 운영정책을 조회할 수 있다.', () => {
    it('성공 시 200을 반환한다.', async () => {
      await transactionTest(dataSource, async () => {
        // given
        const motiPolicy = new MotiPolicy(
          '0.0.1',
          '0.0.1',
          'https://wwww.a.b.com/policy',
        );

        when(mockOperateService.retrieveMotimateOperation()).thenResolve(
          motiPolicy,
        );

        // when
        // then
        return request(app.getHttpServer())
          .get('/api/v1/operate/policy')
          .expect(200)
          .expect((res: request.Response) => {
            expect(res.body.success).toEqual(true);
            expect(res.body.data).toEqual({
              latest: '0.0.1',
              required: '0.0.1',
              privacyPolicy: 'https://wwww.a.b.com/policy',
            });
          });
      });
    });

    it('운영정책이 초기화되지 않았다면 500을 반환한다.', async () => {
      await transactionTest(dataSource, async () => {
        // given

        when(mockOperateService.retrieveMotimateOperation()).thenThrow(
          new PolicyNotFoundException(),
        );

        // when
        // then
        return request(app.getHttpServer())
          .get('/api/v1/operate/policy')
          .expect(500)
          .expect((res: request.Response) => {
            expect(res.body.success).toEqual(false);
            expect(res.body.message).toEqual('운영정책을 조회할 수 없습니다.');
          });
      });
    });
  });
});
