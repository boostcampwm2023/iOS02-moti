import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AuthFixture } from '../../../test/auth/auth-fixture';
import { AchievementService } from '../application/achievement.service';
import {
  anyNumber,
  anyOfClass,
  anything,
  instance,
  mock,
  when,
} from 'ts-mockito';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../app.module';
import { AuthTestModule } from '../../../test/auth/auth-test.module';
import { validationPipeOptions } from '../../config/validation';
import { UnexpectedExceptionFilter } from '../../common/filter/unexpected-exception.filter';
import { MotimateExceptionFilter } from '../../common/filter/exception.filter';
import * as request from 'supertest';
import { AchievementFixture } from '../../../test/achievement/achievement-fixture';
import { UsersFixture } from '../../../test/user/users-fixture';
import { CategoryFixture } from '../../../test/category/category-fixture';
import { PaginateAchievementRequest } from '../dto/paginate-achievement-request';
import { PaginateAchievementResponse } from '../dto/paginate-achievement-response';
import { AchievementResponse } from '../dto/achievement-response';
import { AchievementDetailResponse } from '../dto/achievement-detail-response';
import { NoSuchAchievementException } from '../exception/no-such-achievement.exception';
import { AchievementDeleteResponse } from '../dto/achievement-delete-response';
import { AchievementUpdateResponse } from '../dto/achievement-update-response';
import { InvalidCategoryException } from '../exception/invalid-category.exception';
import { NoUserImageException } from '../exception/no-user-image-exception';

describe('AchievementController', () => {
  let app: INestApplication;
  let authFixture: AuthFixture;
  let mockAchievementService: AchievementService;

  beforeAll(async () => {
    mockAchievementService = mock<AchievementService>(AchievementService);

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, AuthTestModule],
      controllers: [],
      providers: [],
    })
      .overrideProvider(AchievementService)
      .useValue(instance<AchievementService>(mockAchievementService))
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

  describe('getAchievements는 달성기록을 조회할 수 있다.', () => {
    it('성공 시 200을 반환한다.', async () => {
      // given
      const { accessToken } = await authFixture.getAuthenticatedUser('ABC');

      const user = UsersFixture.user('ABC');
      const category = CategoryFixture.category(user, '다이어트');
      const achievements = AchievementFixture.achievements(30, user, category);

      const pageRequest = new PaginateAchievementRequest();
      const pagedAchievements = new PaginateAchievementResponse(
        pageRequest,
        achievements.map((achievement) =>
          AchievementResponse.from(achievement),
        ),
      );

      when(
        mockAchievementService.getAchievements(
          anyNumber(),
          anyOfClass(PaginateAchievementRequest),
        ),
      ).thenResolve(pagedAchievements);

      // then
      // when
      const response = await request(app.getHttpServer())
        .get('/api/v1/achievements')
        .set('Authorization', `Bearer ${accessToken}`)
        .query({ take: '30' })
        .expect(200)
        .expect((res: request.Response) => {
          expect(res.body.success).toBe(true);
          expect(res.body.data).toEqual(pagedAchievements);
        });

      expect(response.status).toEqual(200);
    });

    it('잘못된 인증시 401을 반환한다.', async () => {
      // given
      const accessToken = 'abcd.abcd.efgh';

      // when
      // then
      return request(app.getHttpServer())
        .get('/api/v1/achievements')
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
        .get('/api/v1/achievements')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(401)
        .expect((res: request.Response) => {
          expect(res.body.success).toBe(false);
          expect(res.body.message).toBe('만료된 토큰입니다.');
        });
    });
  });

  describe('getAchievement는 단건의 달성기록을 조회할 수 있다.', () => {
    it('성공 시 200을 반환한다.', async () => {
      // given
      const { accessToken } = await authFixture.getAuthenticatedUser('ABC');

      const achievementDetail = new AchievementDetailResponse({
        id: 1004,
        title: '다이어트 1일차',
        content: '다이어트 1일차입니다.',
        imageUrl: 'file://abcd-efgh-ijkl-mnop.jpg',
        categoryId: 2,
        categoryName: '다이어트',
        createdAt: new Date(),
        achieveCount: 2,
      });

      when(
        mockAchievementService.getAchievementDetail(anyNumber(), 1004),
      ).thenResolve(achievementDetail);

      // when
      // then
      return request(app.getHttpServer())
        .get('/api/v1/achievements/1004')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res: request.Response) => {
          expect(res.body.success).toBe(true);
          expect(res.body.data).toEqual(achievementDetail);
        });
    });

    it('잘못된 인증시 401을 반환한다.', async () => {
      // given
      const accessToken = 'abcd.abcd.efgh';

      // when
      // then
      return request(app.getHttpServer())
        .get('/api/v1/achievements/1004')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(401)
        .expect((res: request.Response) => {
          expect(res.body.success).toBe(false);
          expect(res.body.message).toBe('잘못된 토큰입니다.');
        });
    });

    it('잘못된 인증시 401을 반환한다.', async () => {
      // given
      const { accessToken } =
        await authFixture.getExpiredAccessTokenUser('ABC');

      // when
      // then
      return request(app.getHttpServer())
        .get('/api/v1/achievements/1004')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(401)
        .expect((res: request.Response) => {
          expect(res.body.success).toBe(false);
          expect(res.body.message).toBe('만료된 토큰입니다.');
        });
    });

    it('사용자의 소유가 아닌 달성기록 조회사 400을 반환한다.', async () => {
      // given
      const { accessToken } = await authFixture.getAuthenticatedUser('ABC');

      when(
        mockAchievementService.getAchievementDetail(anyNumber(), 1005),
      ).thenThrow(new NoSuchAchievementException());

      // when
      // then
      return request(app.getHttpServer())
        .get('/api/v1/achievements/1005')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404)
        .expect((res: request.Response) => {
          expect(res.body.success).toBe(false);
          expect(res.body.message).toBe('존재하지 않는 달성기록 입니다.');
        });
    });
  });

  describe('delete는 달성기록을 삭제할 수 있다.', () => {
    it('성공 시 200을 반환한다.', async () => {
      // given
      const { accessToken } = await authFixture.getAuthenticatedUser('ABC');

      const achievementResponse = new AchievementDeleteResponse(1003);

      when(mockAchievementService.delete(anyNumber(), 1003)).thenResolve(
        achievementResponse,
      );

      // when
      // then
      return request(app.getHttpServer())
        .delete('/api/v1/achievements/1003')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res: request.Response) => {
          expect(res.body.success).toBe(true);
          expect(res.body.data).toEqual(achievementResponse);
        });
    });

    it('잘못된 인증시 401을 반환한다.', async () => {
      // given
      const accessToken = 'abcd.abcd.efgh';

      // when
      // then
      return request(app.getHttpServer())
        .delete('/api/v1/achievements/1003')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(401)
        .expect((res: request.Response) => {
          expect(res.body.success).toBe(false);
          expect(res.body.message).toBe('잘못된 토큰입니다.');
        });
    });

    it('잘못된 인증시 401을 반환한다.', async () => {
      // given
      const { accessToken } =
        await authFixture.getExpiredAccessTokenUser('ABC');

      // when
      // then
      return request(app.getHttpServer())
        .delete('/api/v1/achievements/1003')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(401)
        .expect((res: request.Response) => {
          expect(res.body.success).toBe(false);
          expect(res.body.message).toBe('만료된 토큰입니다.');
        });
    });

    it('삭제할 수 없는 달성기록 삭제요청시 400을 반환한다.', async () => {
      // given
      const { accessToken } = await authFixture.getAuthenticatedUser('ABC');

      when(mockAchievementService.delete(anyNumber(), 1005)).thenThrow(
        new NoSuchAchievementException(),
      );

      // when
      // then
      return request(app.getHttpServer())
        .delete('/api/v1/achievements/1005')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404)
        .expect((res: request.Response) => {
          expect(res.body.success).toBe(false);
          expect(res.body.message).toBe('존재하지 않는 달성기록 입니다.');
        });
    });
  });

  describe('update는 달성기록을 수정할 수 있다.', () => {
    it('성공 시 200을 반환한다.', async () => {
      // given
      const { accessToken } = await authFixture.getAuthenticatedUser('ABC');

      const achievementUpdateResponse = new AchievementUpdateResponse(1006);

      when(
        mockAchievementService.update(anyNumber(), 1006, anything()),
      ).thenResolve(achievementUpdateResponse);

      // when
      // then
      return request(app.getHttpServer())
        .put('/api/v1/achievements/1006')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          title: '다이어트 1일차',
          content: '다이어트 1일차입니다.',
          categoryId: 2,
        })
        .expect(200)
        .expect((res: request.Response) => {
          expect(res.body.success).toBe(true);
          expect(res.body.data).toEqual(achievementUpdateResponse);
          expect(res.body.data.id).toEqual(1006);
        });
    });

    it('잘못된 update 요청시 400을 반환한다.', async () => {
      // given
      const { accessToken } = await authFixture.getAuthenticatedUser('ABC');

      // when
      // then
      return request(app.getHttpServer())
        .put('/api/v1/achievements/1006')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(400)
        .expect((res: request.Response) => {
          expect(res.body.success).toBe(false);
          expect(res.body.data.title).toBe('잘못된 제목 이름입니다.');
          expect(res.body.data.content).toBe('잘못된 내용입니다.');
          expect(res.body.data.categoryId).toBe('카테고리를 선택해주세요');
        });
    });

    it('잘못된 인증시 401을 반환한다.', async () => {
      // given
      const accessToken = 'abcd.abcd.efgh';

      // when
      // then
      return request(app.getHttpServer())
        .put('/api/v1/achievements/1006')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(401)
        .expect((res: request.Response) => {
          expect(res.body.success).toBe(false);
          expect(res.body.message).toBe('잘못된 토큰입니다.');
        });
    });

    it('잘못된 인증시 401을 반환한다.', async () => {
      // given
      const { accessToken } =
        await authFixture.getExpiredAccessTokenUser('ABC');

      // when
      // then
      return request(app.getHttpServer())
        .put('/api/v1/achievements/1006')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(401)
        .expect((res: request.Response) => {
          expect(res.body.success).toBe(false);
          expect(res.body.message).toBe('만료된 토큰입니다.');
        });
    });

    it('수정할 수 없는 달성기록 수정요청시 400을 반환한다.', async () => {
      // given
      const { accessToken } = await authFixture.getAuthenticatedUser('ABC');

      when(
        mockAchievementService.update(anyNumber(), 1008, anything()),
      ).thenThrow(new NoSuchAchievementException());

      // when
      // then
      return request(app.getHttpServer())
        .put('/api/v1/achievements/1008')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          title: '다이어트 1일차',
          content: '다이어트 1일차입니다.',
          categoryId: 2,
        })
        .expect(404)
        .expect((res: request.Response) => {
          expect(res.body.success).toBe(false);
          expect(res.body.message).toBe('존재하지 않는 달성기록 입니다.');
        });
    });

    it('수정할 수 없는 카테고리 수정요청시 400을 반환한다.', async () => {
      // given
      const { accessToken } = await authFixture.getAuthenticatedUser('ABC');

      when(
        mockAchievementService.update(anyNumber(), 1010, anything()),
      ).thenThrow(new InvalidCategoryException());

      // when
      // then
      return request(app.getHttpServer())
        .put('/api/v1/achievements/1010')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          title: '다이어트 1일차',
          content: '다이어트 1일차입니다.',
          categoryId: 100,
        })
        .expect(400)
        .expect((res: request.Response) => {
          expect(res.body.success).toBe(false);
          expect(res.body.message).toBe('유효하지 않은 카테고리입니다.');
        });
    });
  });

  describe('create는 달성기록을 생성할 수 있다.', () => {
    it('성공 시 200을 반환한다.', async () => {
      // given
      const { accessToken } = await authFixture.getAuthenticatedUser('ABC');

      const achievementDetail = new AchievementDetailResponse({
        id: 1004,
        title: '다이어트 1일차',
        content: '다이어트 1일차입니다.',
        imageUrl: 'file://abcd-efgh-ijkl-mnop.jpg',
        categoryId: 2,
        categoryName: '다이어트',
        createdAt: new Date(),
        achieveCount: 2,
      });

      when(mockAchievementService.create(anything(), anything())).thenResolve(
        achievementDetail,
      );

      // when
      // then
      return request(app.getHttpServer())
        .post('/api/v1/achievements')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          title: '다이어트 1일차',
          content: '다이어트 1일차입니다.',
          categoryId: 2,
          photoId: 3,
        })
        .expect(201)
        .expect((res: request.Response) => {
          expect(res.body.success).toBe(true);
          expect(res.body.data).toEqual(achievementDetail);
        });
    });

    it('잘못된 create 요청시 400을 반환한다.', async () => {
      // given
      const { accessToken } = await authFixture.getAuthenticatedUser('ABC');

      // when
      // then
      return request(app.getHttpServer())
        .post('/api/v1/achievements')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(400)
        .expect((res: request.Response) => {
          expect(res.body.success).toBe(false);
          expect(res.body.data.title).toBe('잘못된 제목입니다.');
          expect(res.body.data.content).toBe('잘못된 내용입니다.');
          expect(res.body.data.categoryId).toBe('카테고리를 선택해주세요');
        });
    });

    it('잘못된 인증시 401을 반환한다.', async () => {
      // given
      const accessToken = 'abcd.abcd.efgh';

      // when
      // then
      return request(app.getHttpServer())
        .post('/api/v1/achievements')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          title: '다이어트 1일차',
          content: '다이어트 1일차입니다.',
          categoryId: 2,
          photoId: 3,
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
        .post('/api/v1/achievements')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          title: '다이어트 1일차',
          content: '다이어트 1일차입니다.',
          categoryId: 2,
          photoId: 3,
        })
        .expect(401)
        .expect((res: request.Response) => {
          expect(res.body.success).toBe(false);
          expect(res.body.message).toBe('만료된 토큰입니다.');
        });
    });

    it('잘못된 카테고리 요청시 400을 반환한다.', async () => {
      // given
      const { accessToken } = await authFixture.getAuthenticatedUser('ABC');

      when(mockAchievementService.create(anything(), anything())).thenThrow(
        new InvalidCategoryException(),
      );

      // when
      // then
      return request(app.getHttpServer())
        .post('/api/v1/achievements')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          title: '다이어트 1일차',
          content: '다이어트 1일차입니다.',
          categoryId: 100,
          photoId: 3,
        })
        .expect(400)
        .expect((res: request.Response) => {
          expect(res.body.success).toBe(false);
          expect(res.body.message).toBe('유효하지 않은 카테고리입니다.');
        });
    });

    it('잘못된 이미지 요청시 400을 반환한다.', async () => {
      // given
      const { accessToken } = await authFixture.getAuthenticatedUser('ABC');

      when(mockAchievementService.create(anything(), anything())).thenThrow(
        new NoUserImageException(),
      );

      // when
      // then
      return request(app.getHttpServer())
        .post('/api/v1/achievements')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          title: '다이어트 1일차',
          content: '다이어트 1일차입니다.',
          categoryId: 2,
          photoId: 100,
        })
        .expect(400)
        .expect((res: request.Response) => {
          expect(res.body.success).toBe(false);
          expect(res.body.message).toBe('이미지를 찾을 수 없습니다.');
        });
    });
  });
});
