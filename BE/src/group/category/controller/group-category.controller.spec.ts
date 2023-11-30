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

describe('GroupCategoryEntity Test', () => {
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
          console.log(res.body);
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
          console.log(res.body);
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
          console.log(res.body);
          expect(res.body.success).toBe(false);
          expect(res.body.data.name).toBe('잘못된 카테고리 이름입니다.');
        });
    });
  });
});
