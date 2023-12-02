import { Test, TestingModule } from '@nestjs/testing';
import { AuthTestModule } from '../../../../test/auth/auth-test.module';
import { AppModule } from '../../../app.module';
import { anyNumber, anyOfClass, instance, mock, when } from 'ts-mockito';
import { AuthFixture } from '../../../../test/auth/auth-fixture';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { validationPipeOptions } from '../../../config/validation';
import { UnexpectedExceptionFilter } from '../../../common/filter/unexpected-exception.filter';
import { MotimateExceptionFilter } from '../../../common/filter/exception.filter';
import * as request from 'supertest';

import { RejectGroupAchievementResponse } from '../dto/reject-group-achievement-response.dto';
import { User } from '../../../users/domain/user.domain';
import { InvalidRejectRequestException } from '../exception/invalid-reject-request.exception';
import { NoSuchGroupAchievementException } from '../exception/no-such-group-achievement.exception';
import { GroupAchievementService } from '../application/group-achievement.service';

describe('GroupAchievementController', () => {
  let app: INestApplication;
  let authFixture: AuthFixture;
  let mockGroupAchievementService: GroupAchievementService;

  beforeAll(async () => {
    mockGroupAchievementService = mock<GroupAchievementService>(
      GroupAchievementService,
    );

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, AuthTestModule],
      controllers: [],
      providers: [],
    })
      .overrideProvider(GroupAchievementService)
      .useValue(instance<GroupAchievementService>(mockGroupAchievementService))
      .compile();

    authFixture = moduleFixture.get<AuthFixture>(AuthFixture);
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

  describe('특정 그룹 달성 기록을 차단할 수 있다.', () => {
    it('성공 시 200을 반환한다.', async () => {
      // given
      const { accessToken } = await authFixture.getAuthenticatedUser('ABC');

      const rejectGroupAchievementResponse = new RejectGroupAchievementResponse(
        1,
        1,
      );

      when(
        mockGroupAchievementService.reject(
          anyOfClass(User),
          anyNumber(),
          anyNumber(),
        ),
      ).thenResolve(rejectGroupAchievementResponse);

      // when
      // then
      return request(app.getHttpServer())
        .post('/api/v1/groups/1/achievements/1/reject')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res: request.Response) => {
          expect(res.body.success).toEqual(true);
          expect(res.body.data).toEqual({
            userId: 1,
            groupAchievementId: 1,
          });
        });
    });
    it('그룹에 존재하지 않는 달성기록을 차단하려는 경우 400을 반환한다.', async () => {
      // given
      const { accessToken } = await authFixture.getAuthenticatedUser('ABC');

      when(
        mockGroupAchievementService.reject(
          anyOfClass(User),
          anyNumber(),
          anyNumber(),
        ),
      ).thenThrow(new NoSuchGroupAchievementException());

      // when
      // then
      return request(app.getHttpServer())
        .post('/api/v1/groups/1/achievements/1/reject')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(400)
        .expect((res: request.Response) => {
          expect(res.body.success).toEqual(false);
          expect(res.body.message).toEqual(
            '존재하지 않는 그룹 달성기록 입니다.',
          );
        });
    });
    it('다른 그룹에 있는 달성기록을 차단하려는 경우 400을 반환한다.', async () => {
      // given
      const { accessToken } = await authFixture.getAuthenticatedUser('ABC');

      when(
        mockGroupAchievementService.reject(
          anyOfClass(User),
          anyNumber(),
          anyNumber(),
        ),
      ).thenThrow(new InvalidRejectRequestException());

      // when
      // then
      return request(app.getHttpServer())
        .post('/api/v1/groups/1/achievements/1/reject')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(400)
        .expect((res: request.Response) => {
          expect(res.body.success).toEqual(false);
          expect(res.body.message).toEqual('유효하지 않은 차단 요청입니다.');
        });
    });
    it('잘못된 인증시 401을 반환한다.', async () => {
      // given
      const accessToken = 'abcd.abcd.efgh';

      // when
      // then
      return request(app.getHttpServer())
        .post('/api/v1/groups/1/achievements/1/reject')
        .set('Authorization', `Bearer ${accessToken}`)
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
        .post('/api/v1/groups/1/achievements/1/reject')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(401)
        .expect((res: request.Response) => {
          expect(res.body.success).toBe(false);
          expect(res.body.message).toBe('만료된 토큰입니다.');
        });
    });
  });
});
