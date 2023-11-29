import { GroupService } from '../application/group.service';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthTestModule } from '../../../../test/auth/auth-test.module';
import { AppModule } from '../../../app.module';
import { anyOfClass, anything, instance, mock, when } from 'ts-mockito';
import { AuthFixture } from '../../../../test/auth/auth-fixture';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { validationPipeOptions } from '../../../config/validation';
import { UnexpectedExceptionFilter } from '../../../common/filter/unexpected-exception.filter';
import { MotimateExceptionFilter } from '../../../common/filter/exception.filter';
import * as request from 'supertest';
import { CreateGroupRequest } from '../dto/create-group-request.dto';
import { User } from '../../../users/domain/user.domain';
import { GroupResponse } from '../dto/group-response.dto';

describe('GroupController', () => {
  let app: INestApplication;
  let authFixture: AuthFixture;
  let mockGroupService: GroupService;

  beforeAll(async () => {
    mockGroupService = mock<GroupService>(GroupService);

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, AuthTestModule],
      controllers: [],
      providers: [],
    })
      .overrideProvider(GroupService)
      .useValue(instance<GroupService>(mockGroupService))
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

  describe('그룹을 생성할 수 있다.', () => {
    it('성공 시 201을 반환한다.', async () => {
      // given
      const { accessToken } = await authFixture.getAuthenticatedUser('ABC');

      const createGroupRequest = new CreateGroupRequest(
        'Group Name',
        'avatarUrl',
      );

      const groupResponse = new GroupResponse(1, 'Group Name', 'avatarUrl');

      when(mockGroupService.create(anyOfClass(User), anything())).thenResolve(
        groupResponse,
      );

      // when
      // then
      return request(app.getHttpServer())
        .post('/api/v1/groups')
        .send(createGroupRequest)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(201)
        .expect((res: request.Response) => {
          expect(res.body.success).toEqual(true);
          expect(res.body.data).toEqual({
            id: 1,
            name: 'Group Name',
            avatarUrl: 'avatarUrl',
          });
        });
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
  });
});
