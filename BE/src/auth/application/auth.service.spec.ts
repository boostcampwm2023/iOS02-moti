import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { HttpModule } from '@nestjs/axios';
import { JwtModule } from '@nestjs/jwt';
import { CustomTypeOrmModule } from '../../config/typeorm/custom-typeorm.module';
import { UserRepository } from '../../users/entities/user.repository';
import { OauthHandler } from './oauth-handler';
import { OauthRequester } from './oauth-requester';
import { JwtUtils } from './jwt-utils';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmModuleOptions } from '../../config/typeorm';
import { UserCodeGenerator } from './user-code-generator';
import { AppleLoginRequest } from '../dto/apple-login-request.dto';
import { configServiceModuleOptions } from '../../config/config';
import { RefreshAuthRequestDto } from '../dto/refresh-auth-request.dto';
import { User } from '../../users/domain/user.domain';
import { CACHE_MANAGER, CacheModule } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { RefreshTokenNotFoundException } from '../exception/refresh-token-not-found.exception';
import { AuthTestModule } from '../../../test/auth/auth-test.module';
import { anyString, instance, mock, when } from 'ts-mockito';

describe('AuthService', () => {
  let authService: AuthService;
  let mockOauthHandler: OauthHandler;
  let refreshTokenStore: Cache;

  beforeAll(async () => {
    mockOauthHandler = mock<OauthHandler>(OauthHandler);

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        HttpModule,
        CacheModule.register(),
        AuthTestModule,
        JwtModule.register({}),
        CustomTypeOrmModule.forCustomRepository([UserRepository]),
        ConfigModule.forRoot(configServiceModuleOptions),
        TypeOrmModule.forRootAsync(typeOrmModuleOptions),
      ],
      providers: [
        AuthService,
        OauthHandler,
        OauthRequester,
        JwtUtils,
        UserCodeGenerator,
      ],
    })
      .overrideProvider(OauthHandler)
      .useValue(instance<OauthHandler>(mockOauthHandler))
      .compile();

    authService = module.get<AuthService>(AuthService);
    refreshTokenStore = module.get<Cache>(CACHE_MANAGER);
  });

  test('authService가 정의되어 있어야 한다.', () => {
    expect(authService).toBeDefined();
  });

  test('apple login을 처리하고 자체 accessToken, refreshToken을 발급한다.', async () => {
    // given
    const appleLoginRequest = new AppleLoginRequest(
      'eyJraWQiOiJmaDZCczhDIiwiYWxnIjoiUlMyNTYifQ.eyJpc3MiOiJodHRwczovL2FwcGxlaWQuYXBwbGUuY29tIiwiYXVkIjoiY29tLm1vdGltYXRlLm1vdGkiLCJleHAiOjE2OTk2OTkxMzIsImlhdCI6MTY5OTYxMjczMiwic3ViIjoiMDAwODQ4LjEyNTU5ZWUxNTkyYjQ0YWY5NzA1ZmRhYmYyOGFlMzhiLjEwMjQiLCJjX2hhc2giOiJxSkd3ZEhyNEZYb055Qllobm5vQ21RIiwiYXV0aF90aW1lIjoxNjk5NjEyNzMyLCJub25jZV9zdXBwb3J0ZWQiOnRydWV9.dGi4dKG9ezLUu0Zm51sgZaORtQwlbsLj8kMqrIb9wZ52pLeT7-SwFbo1rA-ATZh5PEXS-VGpw6fz7AyTzzYWzxWxvJ8oEDOJE8fHI5JMJiYLHjujim565RT7t36zKWwhWDS1pOn9eQc-ivIEmfSeslzOgre8HucYWfoHu1bsiyWbP1mp3e6Tu_RfR41KUD_E0oOFVw-sDHHkUejjLu2ZjyFYQ75AvivpArfOabsF3D1kl-ONtP2-ImRxLMgFZ9D5y9_8SCtP57kTgFFUm_07ik6srgcg2sn5qhKzQOxOsdHG46pI7XUHuX8N5XoU0cYbA-HefDHCPVfy4N8ikUcQkQ',
    );
    when(mockOauthHandler.getUserIdentifier(anyString())).thenResolve(
      '123456.12559ee1592b44af9705fdabf28ae38b.1234',
    );

    // when
    const response = await authService.appleLogin(appleLoginRequest);

    // then
    const refreshTokenFromStore = await refreshTokenStore.get(
      response.user.userCode,
    );
    expect(response.user).toBeDefined();
    expect(response.accessToken).toBeDefined();
    expect(response.refreshToken).toBeDefined();
    expect(response.refreshToken).toBeDefined();
    expect(refreshTokenFromStore).toBeDefined();
  });

  test('refreshToken을 통해 새로운 accessToken을 발급한다.', async () => {
    // given
    const appleLoginRequest = new AppleLoginRequest(
      'eyJraWQiOiJmaDZCczhDIiwiYWxnIjoiUlMyNTYifQ.eyJpc3MiOiJodHRwczovL2FwcGxlaWQuYXBwbGUuY29tIiwiYXVkIjoiY29tLm1vdGltYXRlLm1vdGkiLCJleHAiOjE2OTk2OTkxMzIsImlhdCI6MTY5OTYxMjczMiwic3ViIjoiMDAwODQ4LjEyNTU5ZWUxNTkyYjQ0YWY5NzA1ZmRhYmYyOGFlMzhiLjEwMjQiLCJjX2hhc2giOiJxSkd3ZEhyNEZYb055Qllobm5vQ21RIiwiYXV0aF90aW1lIjoxNjk5NjEyNzMyLCJub25jZV9zdXBwb3J0ZWQiOnRydWV9.dGi4dKG9ezLUu0Zm51sgZaORtQwlbsLj8kMqrIb9wZ52pLeT7-SwFbo1rA-ATZh5PEXS-VGpw6fz7AyTzzYWzxWxvJ8oEDOJE8fHI5JMJiYLHjujim565RT7t36zKWwhWDS1pOn9eQc-ivIEmfSeslzOgre8HucYWfoHu1bsiyWbP1mp3e6Tu_RfR41KUD_E0oOFVw-sDHHkUejjLu2ZjyFYQ75AvivpArfOabsF3D1kl-ONtP2-ImRxLMgFZ9D5y9_8SCtP57kTgFFUm_07ik6srgcg2sn5qhKzQOxOsdHG46pI7XUHuX8N5XoU0cYbA-HefDHCPVfy4N8ikUcQkQ',
    );
    when(mockOauthHandler.getUserIdentifier(anyString())).thenResolve(
      '123456.12559ee1592b44af9705fdabf28ae38b.1234',
    );

    const loginResponse = await authService.appleLogin(appleLoginRequest);
    const user = User.from('123456.12559ee1592b44af9705fdabf28ae38b.1234');
    user.assignUserCode(loginResponse.user.userCode);

    // // when
    const response = await authService.refresh(
      user,
      new RefreshAuthRequestDto(loginResponse.refreshToken),
    );

    // then
    expect(response.user).toBeDefined();
    expect(response.accessToken).toBeDefined();
  });

  test('유효하지 않은 refreshToken에 대한 요청에 대해서 RefreshTokenNotFoundException를 던진다.', async () => {
    // given
    const user = User.from('123456.12559ee1592b44af9705fdabf28ae38b.1234');
    user.assignUserCode('ABCDEF1');

    // when
    // then
    await expect(
      authService.refresh(
        user,
        new RefreshAuthRequestDto('INVALID_REFRESH_TOKEN'),
      ),
    ).rejects.toThrow(RefreshTokenNotFoundException);
  });
});
