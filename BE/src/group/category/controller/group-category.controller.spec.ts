import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AuthFixture } from '../../../../test/auth/auth-fixture';
import { anyOfClass, instance, mock, when } from 'ts-mockito';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../../app.module';
import { AuthTestModule } from '../../../../test/auth/auth-test.module';
import { validationPipeOptions } from '../../../config/validation';
import { UnexpectedExceptionFilter } from '../../../common/filter/unexpected-exception.filter';
import { MotimateExceptionFilter } from '../../../common/filter/exception.filter';
import { GroupCategoryService } from '../application/group-category.service';
import { GroupFixture } from '../../../../test/group/group/group-fixture';
import * as request from 'supertest';
import { User } from '../../../users/domain/user.domain';
import { GroupCategoryCreate } from '../dto/group-category-create';
import { GroupCategoryFixture } from '../../../../test/group/category/group-category-fixture';
import { UnauthorizedGroupCategoryException } from '../exception/unauthorized-group-category.exception';
import { GroupCategoryMetadata } from '../dto/group-category-metadata';
import { UnauthorizedApproachGroupCategoryException } from '../exception/unauthorized-approach-group-category.exception';

describe('GroupCategoryController Test', () => {
  let app: INestApplication;
  let authFixture: AuthFixture;
  let mockGroupCategoryService: GroupCategoryService;

  beforeAll(async () => {
    mockGroupCategoryService = mock<GroupCategoryService>(GroupCategoryService);

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, AuthTestModule],
      controllers: [],
      providers: [],
    })
      .overrideProvider(GroupCategoryService)
      .useValue(instance<GroupCategoryService>(mockGroupCategoryService))
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
    it('app이 정의되어 있어야 한다.', () => {
      expect(app).toBeDefined();
    });
  });

  describe('그룹 카테고리를 생성할 수 있다.', () => {
    it('그룹장은 그룹 카테고리를 생성할 요청시 카테고리와 201을 반환한다.', async () => {
      // given
      const { accessToken, user } =
        await authFixture.getAuthenticatedUser('ABC');

      const group = GroupFixture.group('그룹1');
      group.id = 1004;

      const groupCategory = GroupCategoryFixture.groupCategory(
        user,
        group,
        '카테고리1004',
      );
      groupCategory.id = 1004;

      when(
        mockGroupCategoryService.createGroupCategory(
          anyOfClass(User),
          1004,
          anyOfClass(GroupCategoryCreate),
        ),
      ).thenResolve(groupCategory);

      // when
      // then
      return request(app.getHttpServer())
        .post(`/api/v1/groups/1004/categories`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          name: '카테고리1',
        })
        .expect(201)
        .expect((res: request.Response) => {
          expect(res.body.success).toEqual(true);
          expect(res.body.data).toEqual({
            id: 1004,
            name: '카테고리1004',
          });
        });
    });

    it('카테고리를 생성할 수 없는 경우 400을 반환한다.', async () => {
      // given
      const { accessToken, user } =
        await authFixture.getAuthenticatedUser('ABC');

      const group = GroupFixture.group('그룹1');
      group.id = 1005;

      const groupCategory = GroupCategoryFixture.groupCategory(
        user,
        group,
        '카테고리1004',
      );
      groupCategory.id = 1005;

      when(
        mockGroupCategoryService.createGroupCategory(
          anyOfClass(User),
          1005,
          anyOfClass(GroupCategoryCreate),
        ),
      ).thenThrow(new UnauthorizedGroupCategoryException());

      // when
      // then
      return request(app.getHttpServer())
        .post(`/api/v1/groups/1005/categories`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          name: '카테고리1',
        })
        .expect(400)
        .expect((res: request.Response) => {
          expect(res.body.success).toEqual(false);
          expect(res.body.message).toEqual(
            '그룹에 카테고리를 만들 수 없습니다.',
          );
        });
    });

    it('잘못된 인증시 401을 반환한다.', async () => {
      // given
      const accessToken = 'abcd.abcd.efgh';

      // when
      // then
      return request(app.getHttpServer())
        .post(`/api/v1/groups/1005/categories`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          name: '카테고리1',
        })
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
        .post(`/api/v1/groups/1005/categories`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          name: '카테고리1',
        })
        .expect(401)
        .expect((res: request.Response) => {
          expect(res.body.success).toBe(false);
          expect(res.body.message).toBe('만료된 토큰입니다.');
        });
    });

    it('잘못된 카테고리 이름으로 요청시 400을 반환한다.', async () => {
      // given
      const { accessToken } = await authFixture.getAuthenticatedUser('ABC');

      // when
      // then
      return request(app.getHttpServer())
        .post(`/api/v1/groups/1006/categories`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          name: '',
        })
        .expect(400)
        .expect((res: request.Response) => {
          expect(res.body.success).toBe(false);
          expect(res.body.data.name).toBe('잘못된 카테고리 이름입니다.');
        });
    });

    describe('그룹 카테고리를 조회할 수 있다.', () => {
      it('그룹에 속한 유저는 그룹 카테고리를 조회할 요청시 카테고리와 200을 반환한다.', async () => {
        // given
        const { accessToken } = await authFixture.getAuthenticatedUser('ABC');

        const groupCategoryMetadata = [
          new GroupCategoryMetadata({
            categoryId: '-1',
            categoryName: null,
            insertedAt: '2021-08-01T00:00:00Z',
            achievementCount: '1',
          }),
          new GroupCategoryMetadata({
            categoryId: '1007',
            categoryName: '카테고리1007',
            insertedAt: '2021-08-01T00:00:00Z',
            achievementCount: '2',
          }),
          new GroupCategoryMetadata({
            categoryId: '1008',
            categoryName: '카테고리1008',
            insertedAt: '2021-08-01T00:00:00Z',
            achievementCount: '3',
          }),
        ];

        when(
          mockGroupCategoryService.retrieveCategoryMetadata(
            anyOfClass(User),
            1007,
          ),
        ).thenResolve(groupCategoryMetadata);

        // when
        // then
        return request(app.getHttpServer())
          .get(`/api/v1/groups/1007/categories`)
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(200)
          .expect((res: request.Response) => {
            expect(res.body.success).toBe(true);
            expect(res.body.data.length).toBe(4);
            expect(res.body.data[0].id).toEqual(0);
            expect(res.body.data[0].name).toEqual('전체');
            expect(res.body.data[0].continued).toEqual(6);
            expect(res.body.data[1].id).toEqual(-1);
            expect(res.body.data[1].name).toEqual('미설정');
            expect(res.body.data[1].continued).toEqual(1);
            expect(res.body.data[2].id).toEqual(1007);
            expect(res.body.data[2].name).toEqual('카테고리1007');
            expect(res.body.data[2].continued).toEqual(2);
            expect(res.body.data[3].id).toEqual(1008);
            expect(res.body.data[3].name).toEqual('카테고리1008');
            expect(res.body.data[3].continued).toEqual(3);
          });
      });

      it('그룹에 속한 유저는 그룹 카테고리를 조회할 요청시 카테고리와 200을 반환한다.', async () => {
        // given
        const { accessToken } = await authFixture.getAuthenticatedUser('ABC');

        const groupCategoryMetadata = [
          new GroupCategoryMetadata({
            categoryId: '1007',
            categoryName: '카테고리1007',
            insertedAt: '2021-08-01T00:00:00Z',
            achievementCount: '2',
          }),
          new GroupCategoryMetadata({
            categoryId: '1008',
            categoryName: '카테고리1008',
            insertedAt: '2021-08-01T00:00:00Z',
            achievementCount: '3',
          }),
        ];

        when(
          mockGroupCategoryService.retrieveCategoryMetadata(
            anyOfClass(User),
            1008,
          ),
        ).thenResolve(groupCategoryMetadata);

        // when
        // then
        return request(app.getHttpServer())
          .get(`/api/v1/groups/1008/categories`)
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(200)
          .expect((res: request.Response) => {
            expect(res.body.success).toBe(true);
            expect(res.body.data.length).toBe(4);
            expect(res.body.data[0].id).toEqual(0);
            expect(res.body.data[0].name).toEqual('전체');
            expect(res.body.data[0].continued).toEqual(5);
            expect(res.body.data[1].id).toEqual(-1);
            expect(res.body.data[1].name).toEqual('미설정');
            expect(res.body.data[1].continued).toEqual(0);
            expect(res.body.data[2].id).toEqual(1007);
            expect(res.body.data[2].name).toEqual('카테고리1007');
            expect(res.body.data[2].continued).toEqual(2);
            expect(res.body.data[3].id).toEqual(1008);
            expect(res.body.data[3].name).toEqual('카테고리1008');
            expect(res.body.data[3].continued).toEqual(3);
          });
      });

      it('그룹에 속하지 않은 유저는 그룹 카테고리를 조회할 요청시 400을 반환한다.', async () => {
        // given
        const { accessToken } = await authFixture.getAuthenticatedUser('ABC');

        const groupCategoryMetadata = [];

        when(
          mockGroupCategoryService.retrieveCategoryMetadata(
            anyOfClass(User),
            1009,
          ),
        ).thenResolve(groupCategoryMetadata);

        // when
        // then
        return request(app.getHttpServer())
          .get(`/api/v1/groups/1009/categories`)
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(200)
          .expect((res: request.Response) => {
            expect(res.body.success).toBe(true);
            expect(res.body.data.length).toBe(2);
            expect(res.body.data[0].id).toEqual(0);
            expect(res.body.data[0].name).toEqual('전체');
            expect(res.body.data[0].continued).toEqual(0);
            expect(res.body.data[1].id).toEqual(-1);
            expect(res.body.data[1].name).toEqual('미설정');
            expect(res.body.data[1].continued).toEqual(0);
          });
      });

      it('잘못된 인증시 401을 반환한다.', async () => {
        // given
        const accessToken = 'abcd.abcd.efgh';

        // when
        // then
        return request(app.getHttpServer())
          .get(`/api/v1/groups/1009/categories`)
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
          .get(`/api/v1/groups/1009/categories`)
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(401)
          .expect((res: request.Response) => {
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe('만료된 토큰입니다.');
          });
      });

      it('그룹에 속하지 않는 사용자의 요청시 403을 반환한다.', async () => {
        // given
        const { accessToken } = await authFixture.getAuthenticatedUser('ABC');

        when(
          mockGroupCategoryService.retrieveCategoryMetadata(
            anyOfClass(User),
            1010,
          ),
        ).thenThrow(new UnauthorizedApproachGroupCategoryException());

        // when
        // then
        return request(app.getHttpServer())
          .get(`/api/v1/groups/1010/categories`)
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(403)
          .expect((res: request.Response) => {
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe(
              '그룹에 카테고리를 조회할 수 없습니다.',
            );
          });
      });
    });
  });

  describe('단 건의 그룹 카테고리를 조회할 수 있다.', () => {
    it('그룹에 속한 유저는 그룹 카테고리를 조회할 요청시 카테고리와 200을 반환한다.', async () => {
      // given
      const { accessToken } = await authFixture.getAuthenticatedUser('ABC');

      const groupCategory = new GroupCategoryMetadata({
        categoryId: '1004',
        categoryName: '카테고리',
        insertedAt: '2021-08-01T00:00:00Z',
        achievementCount: '1',
      });

      when(
        mockGroupCategoryService.retrieveCategoryMetadataById(
          anyOfClass(User),
          1007,
          1004,
        ),
      ).thenResolve(groupCategory);

      // when
      // then
      return request(app.getHttpServer())
        .get(`/api/v1/groups/1007/categories/1004`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res: request.Response) => {
          expect(res.body.success).toBe(true);
          expect(res.body.data.id).toBe(1004);
          expect(res.body.data.name).toBe('카테고리');
          expect(res.body.data.continued).toBe(1);
          expect(res.body.data.lastChallenged).toBe('2021-08-01T00:00:00Z');
        });
    });

    it('그룹에 속한 유저는 그룹 미설정 카테고리를 조회할 요청시 카테고리와 200을 반환한다.', async () => {
      // given
      const { accessToken } = await authFixture.getAuthenticatedUser('ABC');

      const groupCategory = new GroupCategoryMetadata({
        categoryId: '-1',
        categoryName: '미설정',
        insertedAt: '2021-08-01T00:00:00Z',
        achievementCount: '1',
      });

      when(
        mockGroupCategoryService.retrieveCategoryMetadataById(
          anyOfClass(User),
          1007,
          -1,
        ),
      ).thenResolve(groupCategory);

      // when
      // then
      return request(app.getHttpServer())
        .get(`/api/v1/groups/1007/categories/-1`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res: request.Response) => {
          expect(res.body.success).toBe(true);
          expect(res.body.data.id).toBe(-1);
          expect(res.body.data.name).toBe('미설정');
          expect(res.body.data.continued).toBe(1);
          expect(res.body.data.lastChallenged).toBe('2021-08-01T00:00:00Z');
        });
    });

    it('그룹에 속하지 않은 유저는 그룹 카테고리를 조회할 요청시 403을 반환한다.', async () => {
      // given
      const { accessToken } = await authFixture.getAuthenticatedUser('ABC');

      when(
        mockGroupCategoryService.retrieveCategoryMetadataById(
          anyOfClass(User),
          1007,
          1009,
        ),
      ).thenThrow(new UnauthorizedApproachGroupCategoryException());

      // when
      // then
      return request(app.getHttpServer())
        .get(`/api/v1/groups/1007/categories/1009`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(403)
        .expect((res: request.Response) => {
          expect(res.body.success).toBe(false);
          expect(res.body.message).toBe(
            '그룹에 카테고리를 조회할 수 없습니다.',
          );
        });
    });

    it('잘못된 인증시 401을 반환한다.', async () => {
      // given
      const accessToken = 'abcd.abcd.efgh';

      // when
      // then
      return request(app.getHttpServer())
        .get(`/api/v1/groups/1007/categories/1009`)
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
        .get(`/api/v1/groups/1007/categories/1009`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(401)
        .expect((res: request.Response) => {
          expect(res.body.success).toBe(false);
          expect(res.body.message).toBe('만료된 토큰입니다.');
        });
    });
  });
});
