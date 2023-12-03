import { GroupService } from '../application/group.service';
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
import { CreateGroupRequest } from '../dto/create-group-request.dto';
import { User } from '../../../users/domain/user.domain';
import { GroupResponse } from '../dto/group-response.dto';
import { GroupListResponse } from '../dto/group-list-response';
import { UserGroupGrade } from '../domain/user-group-grade';
import { GroupLeaveResponse } from '../dto/group-leave-response.dto';
import { NoSuchUserGroupException } from '../exception/no-such-user-group.exception';
import { LeaderNotAllowedToLeaveException } from '../exception/leader-not-allowed-to-leave.exception';

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
      const createGroupRequest = new CreateGroupRequest(
        'Group Name',
        'avatarUrl',
      );

      // when
      // then
      return request(app.getHttpServer())
        .post('/api/v1/groups')
        .send(createGroupRequest)
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
      const createGroupRequest = new CreateGroupRequest(
        'Group Name',
        'avatarUrl',
      );

      // when
      // then
      return request(app.getHttpServer())
        .post('/api/v1/groups')
        .send(createGroupRequest)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(401)
        .expect((res: request.Response) => {
          expect(res.body.success).toBe(false);
          expect(res.body.message).toBe('만료된 토큰입니다.');
        });
    });
  });
  describe('그룹 이름, 달성 기록 수, 최근 달성 기록 등록일자와 함께 그룹 리스트를 조회할수 있다.', () => {
    it('성공 시 200을 반환한다.', async () => {
      // given
      const { accessToken } = await authFixture.getAuthenticatedUser('ABC');

      const groupListResponse = new GroupListResponse([
        {
          id: 1,
          name: 'Test Group1',
          avatarUrl: 'avatarUrl1',
          continued: 2,
          lastChallenged: '2023-11-29T21:58:402Z',
          grade: UserGroupGrade.LEADER,
        },
        {
          id: 2,
          name: 'Test Group2',
          avatarUrl: 'avatarUrl2',
          continued: 3,
          lastChallenged: null,
          grade: UserGroupGrade.PARTICIPANT,
        },
      ]);

      when(mockGroupService.getGroups(anyNumber())).thenResolve(
        groupListResponse,
      );

      // when
      // then
      return request(app.getHttpServer())
        .get('/api/v1/groups')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res: request.Response) => {
          expect(res.body.success).toEqual(true);
          expect(res.body.data).toEqual({
            data: [
              {
                avatarUrl: 'avatarUrl1',
                continued: 2,
                id: 1,
                lastChallenged: '2023-11-29T21:58:402Z',
                name: 'Test Group1',
                grade: UserGroupGrade.LEADER,
              },
              {
                avatarUrl: 'avatarUrl2',
                continued: 3,
                id: 2,
                lastChallenged: null,
                name: 'Test Group2',
                grade: UserGroupGrade.PARTICIPANT,
              },
            ],
          });
        });
    });
    it('잘못된 인증시 401을 반환한다.', async () => {
      // given
      const accessToken = 'abcd.abcd.efgh';

      // when
      // then
      return request(app.getHttpServer())
        .get('/api/v1/groups')
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
        .get('/api/v1/groups')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(401)
        .expect((res: request.Response) => {
          expect(res.body.success).toBe(false);
          expect(res.body.message).toBe('만료된 토큰입니다.');
        });
    });
  });

  describe('내가 속한 그룹을 탈퇴할 수 있다.', () => {
    it('성공 시 200을 반환한다.', async () => {
      // given
      const { accessToken } = await authFixture.getAuthenticatedUser('ABC');

      const groupLeaveResponse = new GroupLeaveResponse(1, 1);

      when(mockGroupService.removeUser(anyNumber(), anyNumber())).thenResolve(
        groupLeaveResponse,
      );

      // when
      // then
      return request(app.getHttpServer())
        .delete('/api/v1/groups/1/participation')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res: request.Response) => {
          expect(res.body.success).toEqual(true);
          expect(res.body.data).toEqual({
            userId: 1,
            groupId: 1,
          });
        });
    });
    it('사용자가 속한 그룹이 아닌 경우 400을 반환한다.', async () => {
      // given
      const { accessToken } = await authFixture.getAuthenticatedUser('ABC');

      when(mockGroupService.removeUser(anyNumber(), anyNumber())).thenThrow(
        new NoSuchUserGroupException(),
      );

      // when
      // then
      return request(app.getHttpServer())
        .delete('/api/v1/groups/1/participation')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(400)
        .expect((res: request.Response) => {
          expect(res.body.success).toEqual(false);
          expect(res.body.message).toEqual('그룹의 멤버가 아닙니다.');
        });
    });
    it('리더가 탈퇴 시도를 할 경우 400을 반환한다.', async () => {
      // given
      const { accessToken } = await authFixture.getAuthenticatedUser('ABC');

      when(mockGroupService.removeUser(anyNumber(), anyNumber())).thenThrow(
        new LeaderNotAllowedToLeaveException(),
      );

      // when
      // then
      return request(app.getHttpServer())
        .delete('/api/v1/groups/1/participation')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(400)
        .expect((res: request.Response) => {
          expect(res.body.success).toEqual(false);
          expect(res.body.message).toEqual(
            '그룹의 리더는 탈퇴를 할 수 없습니다.',
          );
        });
    });
    it('잘못된 인증시 401을 반환한다.', async () => {
      // given
      const accessToken = 'abcd.abcd.efgh';

      // when
      // then
      return request(app.getHttpServer())
        .get('/api/v1/groups')
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
        .get('/api/v1/groups')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(401)
        .expect((res: request.Response) => {
          expect(res.body.success).toBe(false);
          expect(res.body.message).toBe('만료된 토큰입니다.');
        });
    });
  });
});
