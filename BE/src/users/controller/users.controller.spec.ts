import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AuthFixture } from '../../../test/auth/auth-fixture';
import { UsersService } from '../application/users.service';
import { anyOfClass, anyString, instance, mock, when } from 'ts-mockito';
import { AppModule } from '../../app.module';
import { AuthTestModule } from '../../../test/auth/auth-test.module';
import { Test, TestingModule } from '@nestjs/testing';
import { validationPipeOptions } from '../../config/validation';
import { UnexpectedExceptionFilter } from '../../common/filter/unexpected-exception.filter';
import { MotimateExceptionFilter } from '../../common/filter/exception.filter';
import { RejectUserResponse } from '../dto/reject-user-response.dto';
import { User } from '../domain/user.domain';
import { NoSuchUserException } from '../exception/no-such-user.exception';
import { InvalidRejectRequestException } from '../../group/achievement/exception/invalid-reject-request.exception';
import * as request from 'supertest';
import { RejectUserListResponse } from '../dto/reject-user-list-response.dto';
import { UserBlockedUser } from '../domain/user-blocked-user.domain';
import { UsersFixture } from '../../../test/user/users-fixture';
import { AllowUserResponse } from '../dto/allow-user-response.dto';
import { InvalidAllowRequestException } from '../exception/invalid-allow-request.exception';

describe('UserController Test', () => {
  let app: INestApplication;
  let authFixture: AuthFixture;
  let mockUsersService: UsersService;

  beforeAll(async () => {
    mockUsersService = mock<UsersService>(UsersService);
    when(mockUsersService.getUserByUserCodeWithRoles(anyString())).thenResolve(
      new User(),
    );

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, AuthTestModule],
      controllers: [],
      providers: [],
    })
      .overrideProvider(UsersService)
      .useValue(instance<UsersService>(mockUsersService))
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

  describe('특정 유저를 차단할 수 있다.', () => {
    it('성공 시 200을 반환한다.', async () => {
      // given
      const { accessToken } = await authFixture.getAuthenticatedUser('ABC');
      const rejectUserResponse = new RejectUserResponse('ABCDEF1', 'ABCDEF2');

      when(mockUsersService.reject(anyOfClass(User), anyString())).thenResolve(
        rejectUserResponse,
      );

      // when
      // then
      return request(app.getHttpServer())
        .post('/api/v1/users/ABCDEF1/reject')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect((res: request.Response) => {
          expect(res.body.success).toEqual(true);
          expect(res.body.data).toEqual({
            userCode: 'ABCDEF1',
            blockedUserCode: 'ABCDEF2',
          });
        });
    });
    it('존재하지 유저를 차단하려는 경우 400을 반환한다.', async () => {
      // given
      const { accessToken } = await authFixture.getAuthenticatedUser('ABC');
      when(mockUsersService.reject(anyOfClass(User), anyString())).thenThrow(
        new NoSuchUserException(),
      );

      // when
      // then
      return request(app.getHttpServer())
        .post('/api/v1/users/ABCDEF1/reject')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(400)
        .expect((res: request.Response) => {
          expect(res.body.success).toEqual(false);
          expect(res.body.message).toEqual('존재하지 않는 유저입니다.');
        });
    });
    it('자신 스스로를 차단하려고 하는 경우 400을 반환한다.', async () => {
      // given
      const { accessToken } = await authFixture.getAuthenticatedUser('ABC');
      when(mockUsersService.reject(anyOfClass(User), anyString())).thenThrow(
        new InvalidRejectRequestException(),
      );

      // when
      // then
      return request(app.getHttpServer())
        .post('/api/v1/users/ABCDEF1/reject')
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
        .post('/api/v1/users/ABCDEF1/reject')
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
        .post('/api/v1/users/ABCDEF1/reject')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(401)
        .expect((res: request.Response) => {
          expect(res.body.success).toBe(false);
          expect(res.body.message).toBe('만료된 토큰입니다.');
        });
    });
  });

  describe('차단한 유저 리스트를 조회할 수 있다.', () => {
    it('성공 시 200을 반환한다.', async () => {
      // given
      const { accessToken } = await authFixture.getAuthenticatedUser('ABC');
      const user1 = UsersFixture.user('ABC');
      const user2 = UsersFixture.user('DEF');
      user2.avatarUrl = 'avatarUrl2';
      const user3 = UsersFixture.user('GHI');
      user3.avatarUrl = 'avatarUrl3';

      const rejectDate = new Date(Date.UTC(2023, 11, 2, 12, 31, 10));

      const rejectUserListResponse = new RejectUserListResponse([
        new UserBlockedUser(user1, user2, rejectDate),
        new UserBlockedUser(user1, user3, rejectDate),
      ]);

      when(mockUsersService.getRejectUserList(anyOfClass(User))).thenResolve(
        rejectUserListResponse,
      );

      // when
      // then
      return request(app.getHttpServer())
        .get('/api/v1/users/reject')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect((res: request.Response) => {
          expect(res.body.success).toEqual(true);
          expect(res.body.data).toEqual({
            data: [
              {
                avatarUrl: 'avatarUrl2',
                userCode: 'ABCDDEF',
                createdAt: '2023-12-02T12:31:10Z',
              },
              {
                avatarUrl: 'avatarUrl3',
                userCode: 'ABCDGHI',
                createdAt: '2023-12-02T12:31:10Z',
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
        .get('/api/v1/users/reject')
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
        .get('/api/v1/users/reject')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(401)
        .expect((res: request.Response) => {
          expect(res.body.success).toBe(false);
          expect(res.body.message).toBe('만료된 토큰입니다.');
        });
    });
  });

  describe('유저 차단 해제를 할 수 있다.', () => {
    it('성공 시 200을 반환한다.', async () => {
      // given
      const { accessToken } = await authFixture.getAuthenticatedUser('ABC');
      const allowUserResponse = new AllowUserResponse('ABCDEF1', 'ABCDEF2');

      when(mockUsersService.allow(anyOfClass(User), anyString())).thenResolve(
        allowUserResponse,
      );

      // when
      // then
      return request(app.getHttpServer())
        .delete('/api/v1/users/ABCDEF1/reject')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect((res: request.Response) => {
          expect(res.body.success).toEqual(true);
          expect(res.body.data).toEqual({
            userCode: 'ABCDEF1',
            blockedUserCode: 'ABCDEF2',
          });
        });
    });
    it('존재하지 유저를 차단하려는 경우 400을 반환한다.', async () => {
      // given
      const { accessToken } = await authFixture.getAuthenticatedUser('ABC');
      when(mockUsersService.allow(anyOfClass(User), anyString())).thenThrow(
        new NoSuchUserException(),
      );

      // when
      // then
      return request(app.getHttpServer())
        .delete('/api/v1/users/ABCDEF1/reject')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(400)
        .expect((res: request.Response) => {
          expect(res.body.success).toEqual(false);
          expect(res.body.message).toEqual('존재하지 않는 유저입니다.');
        });
    });
    it('유효하지 않은 차단 해제 요청을 하는 경우 400을 반환한다.', async () => {
      // given
      const { accessToken } = await authFixture.getAuthenticatedUser('ABC');
      when(mockUsersService.allow(anyOfClass(User), anyString())).thenThrow(
        new InvalidAllowRequestException(),
      );

      // when
      // then
      return request(app.getHttpServer())
        .delete('/api/v1/users/ABCDEF1/reject')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(400)
        .expect((res: request.Response) => {
          expect(res.body.success).toEqual(false);
          expect(res.body.message).toEqual(
            '유효하지 않은 차단 해제 요청입니다.',
          );
        });
    });
    it('잘못된 인증시 401을 반환한다.', async () => {
      // given
      const accessToken = 'abcd.abcd.efgh';

      // when
      // then
      return request(app.getHttpServer())
        .delete('/api/v1/users/ABCDEF1/reject')
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
        .delete('/api/v1/users/ABCDEF1/reject')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(401)
        .expect((res: request.Response) => {
          expect(res.body.success).toBe(false);
          expect(res.body.message).toBe('만료된 토큰입니다.');
        });
    });
  });
});
