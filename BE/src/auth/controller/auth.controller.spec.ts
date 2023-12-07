import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AuthFixture } from '../../../test/auth/auth-fixture';
import { anyOfClass, instance, mock, when } from 'ts-mockito';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../app.module';
import { AuthTestModule } from '../../../test/auth/auth-test.module';
import { validationPipeOptions } from '../../config/validation';
import { UnexpectedExceptionFilter } from '../../common/filter/unexpected-exception.filter';
import { MotimateExceptionFilter } from '../../common/filter/exception.filter';
import * as request from 'supertest';
import { AuthService } from '../application/auth.service';
import { AppleLoginResponse } from '../dto/apple-login-response.dto';
import { AppleLoginRequest } from '../dto/apple-login-request.dto';
import { UserDto } from '../../users/dto/user.dto';
import { ExpiredTokenException } from '../exception/expired-token.exception';
import { FetchPublicKeyException } from '../exception/fetch-public-key.exception';
import { InvalidTokenException } from '../exception/invalid-token.exception';
import { RefreshAuthRequestDto } from '../dto/refresh-auth-request.dto';
import { RefreshAuthResponseDto } from '../dto/refresh-auth-response.dto';
import { User } from '../../users/domain/user.domain';
import { RefreshTokenNotFoundException } from '../exception/refresh-token-not-found.exception';

describe('AchievementController', () => {
  let app: INestApplication;
  let authFixture: AuthFixture;
  let mockAuthService: AuthService;

  beforeAll(async () => {
    mockAuthService = mock<AuthService>(AuthService);

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, AuthTestModule],
      controllers: [],
      providers: [],
    })
      .overrideProvider(AuthService)
      .useValue(instance<AuthService>(mockAuthService))
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

  describe('애플 로그인을 할 수 있다.', () => {
    it('성공 시 201을 반환한다.', async () => {
      // given
      const appleLoginResponse = new AppleLoginResponse(
        new UserDto('avatarUrl', 'userCode'),
        'accessToken',
        'refreshToken',
      );
      when(
        mockAuthService.appleLogin(anyOfClass(AppleLoginRequest)),
      ).thenResolve(appleLoginResponse);

      // then
      // when
      return request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send(new AppleLoginRequest('idetityToken'))
        .expect(201)
        .expect((res: request.Response) => {
          expect(res.body.success).toBe(true);
          expect(res.body.data).toEqual({
            accessToken: 'accessToken',
            refreshToken: 'refreshToken',
            user: {
              avatarUrl: 'avatarUrl',
              userCode: 'userCode',
            },
          });
        });
    });

    it('애플의 public rsa key를 가져오다가 오류나는 경우 잘못된 인증시 500을 반환한다.', async () => {
      // given
      when(mockAuthService.appleLogin(anyOfClass(AppleLoginRequest))).thenThrow(
        new FetchPublicKeyException(),
      );

      // when
      // then
      return request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send(new AppleLoginRequest('idetityToken'))
        .expect(500)
        .expect((res: request.Response) => {
          expect(res.body.success).toBe(false);
          expect(res.body.message).toBe(
            'Apple ID 서버로의 public key 요청이 실패했습니다.',
          );
        });
    });

    it('만료된 identityToken에 401을 반환한다.', async () => {
      // given
      when(mockAuthService.appleLogin(anyOfClass(AppleLoginRequest))).thenThrow(
        new ExpiredTokenException(),
      );
      // when
      // then
      return request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send(new AppleLoginRequest('idetityToken'))
        .expect(401)
        .expect((res: request.Response) => {
          expect(res.body.success).toBe(false);
          expect(res.body.message).toBe('만료된 토큰입니다.');
        });
    });
    it('변조된 identityToken에 401을 반환한다.', async () => {
      // given

      when(mockAuthService.appleLogin(anyOfClass(AppleLoginRequest))).thenThrow(
        new InvalidTokenException(),
      );
      // when
      // then
      return request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send(new AppleLoginRequest('idetityToken'))
        .expect(401)
        .expect((res: request.Response) => {
          expect(res.body.success).toBe(false);
          expect(res.body.message).toBe('잘못된 토큰입니다.');
        });
    });
  });

  describe('refresh token으로 새로운 access token을 발급할 수 있다.', () => {
    it('성공 시 201을 반환한다.', async () => {
      // given
      const { accessToken } = await authFixture.getAuthenticatedUser('ABC');

      const refreshAuthResponse = new RefreshAuthResponseDto(
        new UserDto('avatarUrl', 'userCode'),
        'accessToken',
      );

      when(
        mockAuthService.refresh(
          anyOfClass(User),
          anyOfClass(RefreshAuthRequestDto),
        ),
      ).thenResolve(refreshAuthResponse);

      // then
      // when
      return request(app.getHttpServer())
        .post('/api/v1/auth/refresh')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(new RefreshAuthRequestDto('refreshToken'))
        .expect(201)
        .expect((res: request.Response) => {
          expect(res.body.success).toBe(true);
          expect(res.body.data).toEqual({
            accessToken: 'accessToken',
            user: {
              avatarUrl: 'avatarUrl',
              userCode: 'userCode',
            },
          });
        });
    });
    it('존재하지 않는 refresh token으로 요청하는 경우 401을 반환한다.', async () => {
      // given
      const { accessToken } = await authFixture.getAuthenticatedUser('ABC');

      when(
        mockAuthService.refresh(
          anyOfClass(User),
          anyOfClass(RefreshAuthRequestDto),
        ),
      ).thenThrow(new RefreshTokenNotFoundException());

      // then
      // when
      return request(app.getHttpServer())
        .post('/api/v1/auth/refresh')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(new RefreshAuthRequestDto('refreshToken'))
        .expect(401)
        .expect((res: request.Response) => {
          expect(res.body.success).toBe(false);
          expect(res.body.message).toBe('유효하지 않은 리프레시 토큰 입니다.');
        });
    });

    it('만료된 refresh token에 401을 반환한다.', async () => {
      // given
      const { accessToken } = await authFixture.getAuthenticatedUser('ABC');

      when(
        mockAuthService.refresh(
          anyOfClass(User),
          anyOfClass(RefreshAuthRequestDto),
        ),
      ).thenThrow(new ExpiredTokenException());
      // when
      // then
      return request(app.getHttpServer())
        .post('/api/v1/auth/refresh')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(new RefreshAuthRequestDto('refreshToken'))
        .expect(401)
        .expect((res: request.Response) => {
          expect(res.body.success).toBe(false);
          expect(res.body.message).toBe('만료된 토큰입니다.');
        });
    });
    it('변조된 refresh token에 401을 반환한다.', async () => {
      // given
      const { accessToken } = await authFixture.getAuthenticatedUser('ABC');

      when(
        mockAuthService.refresh(
          anyOfClass(User),
          anyOfClass(RefreshAuthRequestDto),
        ),
      ).thenThrow(new InvalidTokenException());
      // when
      // then
      return request(app.getHttpServer())
        .post('/api/v1/auth/refresh')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(new RefreshAuthRequestDto('refreshToken'))
        .expect(401)
        .expect((res: request.Response) => {
          expect(res.body.success).toBe(false);
          expect(res.body.message).toBe('잘못된 토큰입니다.');
        });
    });
    it('잘못된 인증시 401을 반환한다.', async () => {
      // given
      const accessToken = 'abcd.abcd.efgh';

      // when
      // then
      return request(app.getHttpServer())
        .post('/api/v1/auth/refresh')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(new RefreshAuthRequestDto('refreshToken'))
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
        .post('/api/v1/auth/refresh')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(new RefreshAuthRequestDto('refreshToken'))
        .expect(401)
        .expect((res: request.Response) => {
          expect(res.body.success).toBe(false);
          expect(res.body.message).toBe('만료된 토큰입니다.');
        });
    });
  });
});
