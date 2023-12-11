import { Test, TestingModule } from '@nestjs/testing';
import { AuthTestModule } from '../../../../test/auth/auth-test.module';
import { AppModule } from '../../../app.module';
import {
  anyNumber,
  anyOfClass,
  anything,
  instance,
  mock,
  when,
} from 'ts-mockito';
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
import { InvalidCategoryException } from '../../../achievement/exception/invalid-category.exception';
import { NoUserImageException } from '../../../achievement/exception/no-user-image-exception';
import { GroupAchievementDetailResponse } from '../dto/group-achievement-detail-response';
import { PaginateGroupAchievementResponse } from '../dto/paginate-group-achievement-response';
import { PaginateGroupAchievementRequest } from '../dto/paginate-group-achievement-request';
import { UnauthorizedAchievementException } from '../../../achievement/exception/unauthorized-achievement.exception';
import { GroupAchievementDeleteResponse } from '../dto/group-achievement-delete-response';
import { GroupAchievementUpdateRequest } from '../dto/group-achievement-update-request';
import { GroupAchievementUpdateResponse } from '../dto/group-achievement-update-response';

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

  describe('create는 달성기록을 생성할 수 있다.', () => {
    it('성공 시 200을 반환한다.', async () => {
      // given
      const { accessToken, user } =
        await authFixture.getAuthenticatedUser('ABC');

      const achievementDetail = new GroupAchievementDetailResponse({
        id: 1004,
        title: '다이어트 1일차',
        content: '다이어트 1일차입니다.',
        imageUrl: 'file://abcd-efgh-ijkl-mnop.jpg',
        categoryId: 2,
        categoryName: '다이어트',
        createdAt: new Date(),
        achieveCount: 2,
        userCode: user.userCode,
        avatarUrl: user.avatarUrl,
      });

      when(
        mockGroupAchievementService.create(anything(), anything(), anything()),
      ).thenResolve(achievementDetail);

      // when
      // then
      return request(app.getHttpServer())
        .post('/api/v1/groups/1/achievements')
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
        .post('/api/v1/groups/1/achievements')
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
        .post('/api/v1/groups/1/achievements')
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
        .post('/api/v1/groups/1/achievements')
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

      when(
        mockGroupAchievementService.create(anything(), anything(), anything()),
      ).thenThrow(new InvalidCategoryException());

      // when
      // then
      return request(app.getHttpServer())
        .post('/api/v1/groups/1/achievements')
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

      when(
        mockGroupAchievementService.create(anything(), anything(), anything()),
      ).thenThrow(new NoUserImageException());

      // when
      // then
      return request(app.getHttpServer())
        .post('/api/v1/groups/1/achievements')
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

  describe('내가 속한 그룹의 달성 리스트를 조회 할 수 있다.', () => {
    it('성공 시 200을 반환한다.', async () => {
      // given
      const { accessToken } = await authFixture.getAuthenticatedUser('ABC');

      const paginateGroupAchievementResponse =
        new PaginateGroupAchievementResponse(
          new PaginateGroupAchievementRequest(1, 3),
          [
            {
              id: 6,
              title: 'test6',
              user: {
                userCode: 'ABCDEF3',
                avatarUrl: 'avatarUrl1',
              },
              categoryId: 1,
              thumbnailUrl: 'thumbnail_url6',
            },
            {
              id: 3,
              title: 'test3',
              user: {
                userCode: 'ABCDEF2',
                avatarUrl: 'avatarUrl2',
              },
              categoryId: 1,
              thumbnailUrl: 'thumbnail_url3',
            },
            {
              id: 2,
              title: 'test2',
              user: {
                userCode: 'ABCDEF1',
                avatarUrl: 'avatarUrl3',
              },
              categoryId: 1,
              thumbnailUrl: 'thumbnail_url2',
            },
          ],
        );

      when(
        mockGroupAchievementService.getAchievements(
          anyOfClass(User),
          anyNumber(),
          anyOfClass(PaginateGroupAchievementRequest),
        ),
      ).thenResolve(paginateGroupAchievementResponse);

      // when
      // then
      return request(app.getHttpServer())
        .get('/api/v1/groups/1/achievements')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res: request.Response) => {
          expect(res.body.success).toBe(true);
          expect(res.body.data).toEqual({
            count: 3,
            data: [
              {
                categoryId: 1,
                id: 6,
                thumbnailUrl: 'thumbnail_url6',
                title: 'test6',
                user: {
                  avatarUrl: 'avatarUrl1',
                  userCode: 'ABCDEF3',
                },
              },
              {
                categoryId: 1,
                id: 3,
                thumbnailUrl: 'thumbnail_url3',
                title: 'test3',
                user: {
                  avatarUrl: 'avatarUrl2',
                  userCode: 'ABCDEF2',
                },
              },
              {
                categoryId: 1,
                id: 2,
                thumbnailUrl: 'thumbnail_url2',
                title: 'test2',
                user: {
                  avatarUrl: 'avatarUrl3',
                  userCode: 'ABCDEF1',
                },
              },
            ],
            next: {
              categoryId: 1,
              take: 3,
              whereIdLessThan: 2,
            },
          });
        });
    });

    it('잘못된 인증시 401을 반환한다.', async () => {
      // given
      const accessToken = 'abcd.abcd.efgh';

      // when
      // then
      return request(app.getHttpServer())
        .get('/api/v1/groups/1/achievements')
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
        .get('/api/v1/groups/1/achievements')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(401)
        .expect((res: request.Response) => {
          expect(res.body.success).toBe(false);
          expect(res.body.message).toBe('만료된 토큰입니다.');
        });
    });
  });

  describe('getAchievement는 달성기록을 조회할 수 있다.', () => {
    it('성공 시 200을 반환한다.', async () => {
      // given
      const { accessToken, user } =
        await authFixture.getAuthenticatedUser('ABC');

      const achievementDetail = new GroupAchievementDetailResponse({
        id: 1004,
        title: '다이어트 1일차',
        content: '다이어트 1일차입니다.',
        imageUrl: 'file://abcd-efgh-ijkl-mnop.jpg',
        categoryId: 2,
        categoryName: '다이어트',
        createdAt: new Date(),
        achieveCount: 2,
        userCode: user.userCode,
        avatarUrl: user.avatarUrl,
      });

      when(
        mockGroupAchievementService.getAchievementDetail(anything(), 1, 1004),
      ).thenResolve(achievementDetail);

      // when
      // then
      return request(app.getHttpServer())
        .get('/api/v1/groups/1/achievements/1004')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res: request.Response) => {
          expect(res.body.success).toBe(true);
          expect(res.body.data).toEqual(achievementDetail);
        });
    });

    it('조회할 수 없는 달성기록에 대해 403을 반환한다.', async () => {
      // given
      const { accessToken } = await authFixture.getAuthenticatedUser('ABC');

      when(
        mockGroupAchievementService.getAchievementDetail(anything(), 1, 1005),
      ).thenThrow(new UnauthorizedAchievementException());

      // when
      // then
      return request(app.getHttpServer())
        .get('/api/v1/groups/1/achievements/1005')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(403)
        .expect((res: request.Response) => {
          expect(res.body.success).toBe(false);
          expect(res.body.message).toBe('달성기록에 접근할 수 없습니다.');
        });
    });

    it('잘못된 인증시 401을 반환한다.', async () => {
      // given
      const accessToken = 'abcd.abcd.efgh';

      // when
      // then
      return request(app.getHttpServer())
        .get('/api/v1/groups/1/achievements/1006')
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
        .get('/api/v1/groups/1/achievements/1007')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(401)
        .expect((res: request.Response) => {
          expect(res.body.success).toBe(false);
          expect(res.body.message).toBe('만료된 토큰입니다.');
        });
    });
  });

  describe('내가 작성한 달성기록을 삭제할 수 있다.', () => {
    it('성공 시 200을 반환한다.', async () => {
      // given
      const { accessToken, user } =
        await authFixture.getAuthenticatedUser('ABC');

      const groupAchievementDeleteResponse = new GroupAchievementDeleteResponse(
        1,
      );

      when(
        mockGroupAchievementService.delete(
          anyNumber(),
          anyNumber(),
          anyNumber(),
        ),
      ).thenResolve(groupAchievementDeleteResponse);

      // when
      // then
      return request(app.getHttpServer())
        .delete('/api/v1/groups/1/achievements/1')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res: request.Response) => {
          expect(res.body.success).toBe(true);
          expect(res.body.data).toEqual({ id: 1 });
        });
    });

    it('삭제할 수 없는 달성기록에 대해 400을 반환한다.', async () => {
      // given
      const { accessToken } = await authFixture.getAuthenticatedUser('ABC');

      when(
        mockGroupAchievementService.delete(
          anyNumber(),
          anyNumber(),
          anyNumber(),
        ),
      ).thenThrow(new NoSuchGroupAchievementException());

      // when
      // then
      return request(app.getHttpServer())
        .delete('/api/v1/groups/1/achievements/1')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(400)
        .expect((res: request.Response) => {
          expect(res.body.success).toBe(false);
          expect(res.body.message).toBe('존재하지 않는 그룹 달성기록 입니다.');
        });
    });

    it('삭제 권한이 없는 경우에는 403을 반환한다.', async () => {
      // given
      const { accessToken } = await authFixture.getAuthenticatedUser('ABC');

      when(
        mockGroupAchievementService.delete(
          anyNumber(),
          anyNumber(),
          anyNumber(),
        ),
      ).thenThrow(new UnauthorizedAchievementException());

      // when
      // then
      return request(app.getHttpServer())
        .delete('/api/v1/groups/1/achievements/1')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(403)
        .expect((res: request.Response) => {
          expect(res.body.success).toBe(false);
          expect(res.body.message).toBe('달성기록에 접근할 수 없습니다.');
        });
    });

    it('잘못된 인증시 401을 반환한다.', async () => {
      // given
      const accessToken = 'abcd.abcd.efgh';

      // when
      // then
      return request(app.getHttpServer())
        .delete('/api/v1/groups/1/achievements/1')
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
        .delete('/api/v1/groups/1/achievements/1')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(401)
        .expect((res: request.Response) => {
          expect(res.body.success).toBe(false);
          expect(res.body.message).toBe('만료된 토큰입니다.');
        });
    });
  });

  describe('내가 작성한 달성기록을 수정 할 수 있다.', () => {
    it('성공 시 200을 반환한다.', async () => {
      // given
      const { accessToken, user } =
        await authFixture.getAuthenticatedUser('ABC');

      const groupAchievementUpdateResponse = new GroupAchievementUpdateResponse(
        1,
      );

      when(
        mockGroupAchievementService.update(
          anyNumber(),
          anyNumber(),
          anyNumber(),
          anyOfClass(GroupAchievementUpdateRequest),
        ),
      ).thenResolve(groupAchievementUpdateResponse);

      // when
      // then
      return request(app.getHttpServer())
        .put('/api/v1/groups/1/achievements/1')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(new GroupAchievementUpdateRequest('title', 'content', 1))
        .expect(200)
        .expect((res: request.Response) => {
          expect(res.body.success).toBe(true);
          expect(res.body.data).toEqual({ id: 1 });
        });
    });

    it('삭제할 수 없는 달성기록에 대해 400을 반환한다.', async () => {
      // given
      const { accessToken } = await authFixture.getAuthenticatedUser('ABC');

      when(
        mockGroupAchievementService.update(
          anyNumber(),
          anyNumber(),
          anyNumber(),
          anyOfClass(GroupAchievementUpdateRequest),
        ),
      ).thenThrow(new NoSuchGroupAchievementException());

      // when
      // then
      return request(app.getHttpServer())
        .put('/api/v1/groups/1/achievements/1')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(new GroupAchievementUpdateRequest('title', 'content', 1))
        .expect(400)
        .expect((res: request.Response) => {
          expect(res.body.success).toBe(false);
          expect(res.body.message).toBe('존재하지 않는 그룹 달성기록 입니다.');
        });
    });

    it('잘못된 인증시 401을 반환한다.', async () => {
      // given
      const accessToken = 'abcd.abcd.efgh';

      // when
      // then
      return request(app.getHttpServer())
        .put('/api/v1/groups/1/achievements/1')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(new GroupAchievementUpdateRequest('title', 'content', 1))
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
        .put('/api/v1/groups/1/achievements/1')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(new GroupAchievementUpdateRequest('title', 'content', 1))
        .expect(401)
        .expect((res: request.Response) => {
          expect(res.body.success).toBe(false);
          expect(res.body.message).toBe('만료된 토큰입니다.');
        });
    });
  });
});
