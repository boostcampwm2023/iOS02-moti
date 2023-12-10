import { GroupService } from '../application/group.service';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthTestModule } from '../../../../test/auth/auth-test.module';
import { AppModule } from '../../../app.module';
import {
  anyNumber,
  anyOfClass,
  anyString,
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
import { InviteGroupRequest } from '../dto/invite-group-request.dto';
import { InviteGroupResponse } from '../dto/invite-group-response';
import { InvitePermissionDeniedException } from '../exception/invite-permission-denied.exception';
import { DuplicatedInviteException } from '../exception/duplicated-invite.exception';
import { GroupUserListResponse } from '../dto/group-user-list-response';
import { AssignGradeResponse } from '../dto/assign-grade-response.dto';
import { AssignGradeRequest } from '../dto/assign-grade-request.dto';
import { OnlyLeaderAllowedAssignGradeException } from '../exception/only-leader-allowed-assign-grade.exception';
import { JoinGroupRequest } from '../dto/join-group-request.dto';
import { JoinGroupResponse } from '../dto/join-group-response.dto';
import { NoSucGroupException } from '../exception/no-such-group.exception';
import { DuplicatedJoinException } from '../exception/duplicated-join.exception';

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
          groupCode: 'GABACD1',
          continued: 2,
          lastChallenged: '2023-11-29T21:58:402Z',
          grade: UserGroupGrade.LEADER,
        },
        {
          id: 2,
          name: 'Test Group2',
          avatarUrl: 'avatarUrl2',
          groupCode: 'GABACD2',
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
                groupCode: 'GABACD1',
                continued: 2,
                id: 1,
                lastChallenged: '2023-11-29T21:58:402Z',
                name: 'Test Group1',
                grade: UserGroupGrade.LEADER,
              },
              {
                avatarUrl: 'avatarUrl2',
                groupCode: 'GABACD2',
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

  describe('그룹원을 초대할 수 있다.', () => {
    it('성공 시 200을 반환한다.', async () => {
      // given
      const { accessToken } = await authFixture.getAuthenticatedUser('ABC');

      const inviteGroupResponse = new InviteGroupResponse(1, 'ABCDEF2');

      when(
        mockGroupService.invite(
          anyOfClass(User),
          anyNumber(),
          anyOfClass(InviteGroupRequest),
        ),
      ).thenResolve(inviteGroupResponse);

      // when
      // then
      return request(app.getHttpServer())
        .post('/api/v1/groups/1/users')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(new InviteGroupRequest('ABCDEF2'))
        .expect(200)
        .expect((res: request.Response) => {
          expect(res.body.success).toEqual(true);
          expect(res.body.data).toEqual({
            groupId: 1,
            userCode: 'ABCDEF2',
          });
        });
    });
    it('사용자가 속한 그룹이 아닌 경우 400을 반환한다.', async () => {
      // given
      const { accessToken } = await authFixture.getAuthenticatedUser('ABC');

      when(
        mockGroupService.invite(
          anyOfClass(User),
          anyNumber(),
          anyOfClass(InviteGroupRequest),
        ),
      ).thenThrow(new NoSuchUserGroupException());

      // when
      // then
      return request(app.getHttpServer())
        .post('/api/v1/groups/1/users')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(new InviteGroupRequest('ABCDEF2'))
        .expect(400)
        .expect((res: request.Response) => {
          expect(res.body.success).toEqual(false);
          expect(res.body.message).toEqual('그룹의 멤버가 아닙니다.');
        });
    });
    it('리더나 매니저가 아닌 경우 경우 400을 반환한다.', async () => {
      // given
      const { accessToken } = await authFixture.getAuthenticatedUser('ABC');

      when(
        mockGroupService.invite(
          anyOfClass(User),
          anyNumber(),
          anyOfClass(InviteGroupRequest),
        ),
      ).thenThrow(new InvitePermissionDeniedException());

      // when
      // then
      return request(app.getHttpServer())
        .post('/api/v1/groups/1/users')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(new InviteGroupRequest('ABCDEF2'))
        .expect(400)
        .expect((res: request.Response) => {
          expect(res.body.success).toEqual(false);
          expect(res.body.message).toEqual('그룹원 초대 권한이 없습니다.');
        });
    });
    it('이미 초대된 유저를 초대하는 경우 400을 반환한다.', async () => {
      // given
      const { accessToken } = await authFixture.getAuthenticatedUser('ABC');

      when(
        mockGroupService.invite(
          anyOfClass(User),
          anyNumber(),
          anyOfClass(InviteGroupRequest),
        ),
      ).thenThrow(new DuplicatedInviteException());

      // when
      // then
      return request(app.getHttpServer())
        .post('/api/v1/groups/1/users')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(new InviteGroupRequest('ABCDEF2'))
        .expect(400)
        .expect((res: request.Response) => {
          expect(res.body.success).toEqual(false);
          expect(res.body.message).toEqual('이미 초대된 그룹원 입니다.');
        });
    });
    it('잘못된 인증시 401을 반환한다.', async () => {
      // given
      const accessToken = 'abcd.abcd.efgh';

      // when
      // then
      return request(app.getHttpServer())
        .post('/api/v1/groups/1/users')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(new InviteGroupRequest('ABCDEF2'))
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
        .post('/api/v1/groups/1/users')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(new InviteGroupRequest('ABCDEF2'))
        .expect(401)
        .expect((res: request.Response) => {
          expect(res.body.success).toBe(false);
          expect(res.body.message).toBe('만료된 토큰입니다.');
        });
    });
  });

  describe('그룹원 정보를 조회할 수 있다.', () => {
    it('성공 시 200을 반환한다.', async () => {
      // given
      const { accessToken } = await authFixture.getAuthenticatedUser('ABC');

      const groupUserListResponse = new GroupUserListResponse([
        {
          avatarUrl: null,
          grade: 'LEADER',
          lastChallenged: '2023-12-04T03:44:17.583Z',
          userCode: 'ABCDABC',
        },
        {
          avatarUrl: null,
          grade: 'PARTICIPANT',
          lastChallenged: '2023-12-04T03:44:17.586Z',
          userCode: 'ABCDDEF',
        },
      ]);

      when(
        mockGroupService.getGroupUsers(anyOfClass(User), anyNumber()),
      ).thenResolve(groupUserListResponse);

      // when
      // then
      return request(app.getHttpServer())
        .get('/api/v1/groups/1/users')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res: request.Response) => {
          expect(res.body.success).toEqual(true);
          expect(res.body.data).toEqual({
            data: [
              {
                avatarUrl: null,
                grade: 'LEADER',
                lastChallenged: '2023-12-04T03:44:17.583Z',
                userCode: 'ABCDABC',
              },
              {
                avatarUrl: null,
                grade: 'PARTICIPANT',
                lastChallenged: '2023-12-04T03:44:17.586Z',
                userCode: 'ABCDDEF',
              },
            ],
          });
        });
    });
    it('사용자가 속한 그룹이 아닌 경우 400을 반환한다.', async () => {
      // given
      const { accessToken } = await authFixture.getAuthenticatedUser('ABC');

      when(
        mockGroupService.getGroupUsers(anyOfClass(User), anyNumber()),
      ).thenThrow(new NoSuchUserGroupException());

      // when
      // then
      return request(app.getHttpServer())
        .get('/api/v1/groups/1/users')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(400)
        .expect((res: request.Response) => {
          expect(res.body.success).toEqual(false);
          expect(res.body.message).toEqual('그룹의 멤버가 아닙니다.');
        });
    });

    it('잘못된 인증시 401을 반환한다.', async () => {
      // given
      const accessToken = 'abcd.abcd.efgh';

      // when
      // then
      return request(app.getHttpServer())
        .get('/api/v1/groups/1/users')
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
        .get('/api/v1/groups/1/users')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(401)
        .expect((res: request.Response) => {
          expect(res.body.success).toBe(false);
          expect(res.body.message).toBe('만료된 토큰입니다.');
        });
    });
  });

  describe('리더는 그룹원의 권한을 변경할 수 있다.', () => {
    it('성공 시 200을 반환한다.', async () => {
      // given
      const { accessToken } = await authFixture.getAuthenticatedUser('ABC');

      const assignGradeResponse = new AssignGradeResponse(
        1,
        'ABCDEF1',
        UserGroupGrade.MANAGER,
      );

      when(
        mockGroupService.updateGroupGrade(
          anyOfClass(User),
          anyNumber(),
          anyString(),
          anyOfClass(AssignGradeRequest),
        ),
      ).thenResolve(assignGradeResponse);

      // when
      // then
      return request(app.getHttpServer())
        .post('/api/v1/groups/1/users/ABCDEF1/auth')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(new AssignGradeRequest(UserGroupGrade.MANAGER))
        .expect(200)
        .expect((res: request.Response) => {
          expect(res.body.success).toEqual(true);
          expect(res.body.data).toEqual({
            groupId: 1,
            userCode: 'ABCDEF1',
            grade: UserGroupGrade.MANAGER,
          });
        });
    });
    it('리더가 아닌 경우 400을 반환한다.', async () => {
      // given
      const { accessToken } = await authFixture.getAuthenticatedUser('ABC');

      when(
        mockGroupService.updateGroupGrade(
          anyOfClass(User),
          anyNumber(),
          anyString(),
          anyOfClass(AssignGradeRequest),
        ),
      ).thenThrow(new OnlyLeaderAllowedAssignGradeException());

      // when
      // then
      return request(app.getHttpServer())
        .post('/api/v1/groups/1/users/ABCDEF1/auth')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(new AssignGradeRequest(UserGroupGrade.MANAGER))
        .expect(400)
        .expect((res: request.Response) => {
          expect(res.body.success).toEqual(false);
          expect(res.body.message).toEqual(
            '그룹의 리더만 권한 조정이 가능합니다.',
          );
        });
    });

    it('초대하려는 멤버가 그룹원이 아닌 경우 400을 반환한다.', async () => {
      // given
      const { accessToken } = await authFixture.getAuthenticatedUser('ABC');

      when(
        mockGroupService.updateGroupGrade(
          anyOfClass(User),
          anyNumber(),
          anyString(),
          anyOfClass(AssignGradeRequest),
        ),
      ).thenThrow(new NoSuchUserGroupException());

      // when
      // then
      return request(app.getHttpServer())
        .post('/api/v1/groups/1/users/ABCDEF1/auth')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(new AssignGradeRequest(UserGroupGrade.MANAGER))
        .expect(400)
        .expect((res: request.Response) => {
          expect(res.body.success).toEqual(false);
          expect(res.body.message).toEqual('그룹의 멤버가 아닙니다.');
        });
    });

    it('잘못된 인증시 401을 반환한다.', async () => {
      // given
      const accessToken = 'abcd.abcd.efgh';

      // when
      // then
      return request(app.getHttpServer())
        .get('/api/v1/groups/1/users')
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
        .get('/api/v1/groups/1/users')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(401)
        .expect((res: request.Response) => {
          expect(res.body.success).toBe(false);
          expect(res.body.message).toBe('만료된 토큰입니다.');
        });
    });
  });
  describe('그룹 코드를 통해서 그룹에 참여할 수 있다.', () => {
    it('성공 시 200을 반환한다.', async () => {
      // given
      const { accessToken } = await authFixture.getAuthenticatedUser('ABC');

      const joinGroupResponse = new JoinGroupResponse('GWEGAQ1', 'ABCDEF2');

      when(
        mockGroupService.join(anyOfClass(User), anyOfClass(JoinGroupRequest)),
      ).thenResolve(joinGroupResponse);

      // when
      // then
      return request(app.getHttpServer())
        .post('/api/v1/groups/participation')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(new JoinGroupRequest('GWEGAQ1'))
        .expect(200)
        .expect((res: request.Response) => {
          expect(res.body.success).toEqual(true);
          expect(res.body.data).toEqual({
            groupCode: 'GWEGAQ1',
            userCode: 'ABCDEF2',
          });
        });
    });
    it('존재 하지 않는 그룹인 경우 404을 반환한다.', async () => {
      // given
      const { accessToken } = await authFixture.getAuthenticatedUser('ABC');

      when(
        mockGroupService.join(anyOfClass(User), anyOfClass(JoinGroupRequest)),
      ).thenThrow(new NoSucGroupException());

      // when
      // then
      return request(app.getHttpServer())
        .post('/api/v1/groups/participation')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(new JoinGroupRequest('GWEGAQ1'))
        .expect(404)
        .expect((res: request.Response) => {
          expect(res.body.success).toEqual(false);
          expect(res.body.message).toEqual('존재하지 않는 그룹 입니다.');
        });
    });
    it('이미 가입된 그룹인 경우 400을 반환한다.', async () => {
      // given
      const { accessToken } = await authFixture.getAuthenticatedUser('ABC');

      when(
        mockGroupService.join(anyOfClass(User), anyOfClass(JoinGroupRequest)),
      ).thenThrow(new DuplicatedJoinException());

      // when
      // then
      return request(app.getHttpServer())
        .post('/api/v1/groups/participation')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(new JoinGroupRequest('GWEGAQ1'))
        .expect(400)
        .expect((res: request.Response) => {
          expect(res.body.success).toEqual(false);
          expect(res.body.message).toEqual('이미 그룹의 그룹원 입니다.');
        });
    });

    it('잘못된 인증시 401을 반환한다.', async () => {
      // given
      const accessToken = 'abcd.abcd.efgh';

      // when
      // then
      return request(app.getHttpServer())
        .post('/api/v1/groups/participation')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(new JoinGroupRequest('GWEGAQ1'))
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
        .post('/api/v1/groups/participation')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(new JoinGroupRequest('GWEGAQ1'))
        .expect(401)
        .expect((res: request.Response) => {
          expect(res.body.success).toBe(false);
          expect(res.body.message).toBe('만료된 토큰입니다.');
        });
    });
  });
});
