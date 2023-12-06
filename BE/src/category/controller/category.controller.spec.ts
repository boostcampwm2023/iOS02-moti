import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AuthFixture } from '../../../test/auth/auth-fixture';
import { anyOfClass, instance, mock, when } from 'ts-mockito';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../app.module';
import { AuthTestModule } from '../../../test/auth/auth-test.module';
import { validationPipeOptions } from '../../config/validation';
import { UnexpectedExceptionFilter } from '../../common/filter/unexpected-exception.filter';
import { MotimateExceptionFilter } from '../../common/filter/exception.filter';
import { CategoryService } from '../application/category.service';
import { User } from '../../users/domain/user.domain';
import * as request from 'supertest';
import { Category } from '../domain/category.domain';
import { CategoryCreate } from '../dto/category-create';
import { CategoryMetaData } from '../dto/category-metadata';
import { GroupCategoryMetadata } from '../../group/category/dto/group-category-metadata';
import { NotFoundCategoryException } from '../exception/not-found-category.exception';

describe('CategoryController Test', () => {
  let app: INestApplication;
  let authFixture: AuthFixture;
  let mockCategoryService: CategoryService;

  beforeAll(async () => {
    mockCategoryService = mock<CategoryService>(CategoryService);

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, AuthTestModule],
      controllers: [],
      providers: [],
    })
      .overrideProvider(CategoryService)
      .useValue(instance<CategoryService>(mockCategoryService))
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
    it('사용자가 카테고리 생성 요청시 카테고리와 201을 반환한다.', async () => {
      // given
      const { accessToken } = await authFixture.getAuthenticatedUser('ABC');

      const category = new Category(undefined, '카테고리1004');
      category.id = 1004;

      when(
        mockCategoryService.saveCategory(
          anyOfClass(CategoryCreate),
          anyOfClass(User),
        ),
      ).thenResolve(category);

      // when
      // then
      return request(app.getHttpServer())
        .post(`/api/v1/categories`)
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

    it('잘못된 인증시 401을 반환한다.', async () => {
      // given
      const accessToken = 'abcd.abcd.efgh';

      // when
      // then
      return request(app.getHttpServer())
        .post(`/api/v1/categories`)
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
        .post(`/api/v1/categories`)
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
        .post(`/api/v1/categories`)
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
  });

  describe('카테고리를 조회할 수 있다.', () => {
    it('그룹에 속한 유저는 그룹 카테고리를 조회할 요청시 카테고리와 200을 반환한다.', async () => {
      // given
      const { accessToken } = await authFixture.getAuthenticatedUser('ABC');

      const categoryMetadata = [
        new CategoryMetaData({
          categoryId: '-1',
          categoryName: null,
          insertedAt: '2021-08-01T00:00:00Z',
          achievementCount: '1',
        }),
        new CategoryMetaData({
          categoryId: '1007',
          categoryName: '카테고리1007',
          insertedAt: '2021-08-01T00:00:00Z',
          achievementCount: '2',
        }),
        new CategoryMetaData({
          categoryId: '1008',
          categoryName: '카테고리1008',
          insertedAt: '2021-08-01T00:00:00Z',
          achievementCount: '3',
        }),
      ];

      when(
        mockCategoryService.getCategoriesByUser(anyOfClass(User)),
      ).thenResolve(categoryMetadata);

      // when
      // then
      return request(app.getHttpServer())
        .get(`/api/v1/categories`)
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

    it('그룹에 속하지 않은 유저는 그룹 카테고리를 조회할 요청시 400을 반환한다.', async () => {
      // given
      const { accessToken } = await authFixture.getAuthenticatedUser('ABC');

      const groupCategoryMetadata = [];

      when(
        mockCategoryService.getCategoriesByUser(anyOfClass(User)),
      ).thenResolve(groupCategoryMetadata);

      // when
      // then
      return request(app.getHttpServer())
        .get(`/api/v1/categories`)
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
        .get(`/api/v1/categories`)
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
        .get(`/api/v1/categories`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(401)
        .expect((res: request.Response) => {
          expect(res.body.success).toBe(false);
          expect(res.body.message).toBe('만료된 토큰입니다.');
        });
    });
  });

  describe('단 건의 카테고리를 조회할 수 있다.', () => {
    it('사용자는 자신의 카테고리를 조회할 요청시 카테고리와 200을 반환한다.', async () => {
      // given
      const { accessToken } = await authFixture.getAuthenticatedUser('ABC');

      const category = new GroupCategoryMetadata({
        categoryId: '1005',
        categoryName: '카테고리',
        insertedAt: '2021-08-01T00:00:00Z',
        achievementCount: '1',
      });

      when(mockCategoryService.getCategory(anyOfClass(User), 1005)).thenResolve(
        category,
      );

      // when
      // then
      return request(app.getHttpServer())
        .get(`/api/v1/categories/1005`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res: request.Response) => {
          expect(res.body.success).toBe(true);
          expect(res.body.data.id).toBe(1005);
          expect(res.body.data.name).toBe('카테고리');
          expect(res.body.data.continued).toBe(1);
          expect(res.body.data.lastChallenged).toBe('2021-08-01T00:00:00Z');
        });
    });

    it('본인 소유의 카테고리가 아닌 조회 요청시 404를 반환한다.', async () => {
      // given
      const { accessToken } = await authFixture.getAuthenticatedUser('ABC');

      when(mockCategoryService.getCategory(anyOfClass(User), 1006)).thenThrow(
        new NotFoundCategoryException(),
      );

      // when
      // then
      return request(app.getHttpServer())
        .get(`/api/v1/categories/1006`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404)
        .expect((res: request.Response) => {
          expect(res.body.success).toBe(false);
          expect(res.body.message).toBe('카테고리를 찾을 수 없습니다.');
        });
    });

    it('잘못된 인증시 401을 반환한다.', async () => {
      // given
      const accessToken = 'abcd.abcd.efgh';

      // when
      // then
      return request(app.getHttpServer())
        .get(`/api/v1/categories/1006`)
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
        .get(`/api/v1/categories/1006`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(401)
        .expect((res: request.Response) => {
          expect(res.body.success).toBe(false);
          expect(res.body.message).toBe('만료된 토큰입니다.');
        });
    });
  });
});
