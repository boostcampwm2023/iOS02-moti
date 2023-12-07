import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AuthFixture } from '../../../../test/auth/auth-fixture';
import { anyOfClass, instance, mock, when } from 'ts-mockito';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../../app.module';
import { AuthTestModule } from '../../../../test/auth/auth-test.module';
import { validationPipeOptions } from '../../../config/validation';
import { UnexpectedExceptionFilter } from '../../../common/filter/unexpected-exception.filter';
import { MotimateExceptionFilter } from '../../../common/filter/exception.filter';
import { GroupAchievementEmojiService } from '../application/group-achievement-emoji.service';
import { GroupAchievementEmojiResponse } from '../dto/group-achievement-emoji-response';
import { Emoji } from '../domain/emoji';
import { User } from '../../../users/domain/user.domain';
import * as request from 'supertest';
import { UnauthorizedAchievementException } from '../../../achievement/exception/unauthorized-achievement.exception';
import { NoSuchGroupUserException } from '../../achievement/exception/no-such-group-user.exception';

describe('GroupAchievementEmojiController Test', () => {
  let app: INestApplication;
  let authFixture: AuthFixture;
  let mockGroupAchievementEmojiService: GroupAchievementEmojiService;

  beforeAll(async () => {
    mockGroupAchievementEmojiService = mock<GroupAchievementEmojiService>(
      GroupAchievementEmojiService,
    );

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, AuthTestModule],
      controllers: [],
      providers: [],
    })
      .overrideProvider(GroupAchievementEmojiService)
      .useValue(
        instance<GroupAchievementEmojiService>(
          mockGroupAchievementEmojiService,
        ),
      )
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

  describe('그룹 도전기록에 이모지를 토글할 수 있다.', () => {
    it('그룹 도전기록에 이모지를 성공적으로 토글하면 200을 반환한다.', async () => {
      const { accessToken } = await authFixture.getAuthenticatedUser('ABC');

      const groupAchievementEmojiResponse = GroupAchievementEmojiResponse.of(
        Emoji.SMILE,
        true,
      );

      when(
        mockGroupAchievementEmojiService.toggleAchievementEmoji(
          anyOfClass(User),
          1004,
          1004,
          Emoji.SMILE,
        ),
      ).thenResolve(groupAchievementEmojiResponse);

      // when
      // then
      return request(app.getHttpServer())
        .post(`/api/v1/groups/1004/achievements/1004/emojis/SMILE`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(201)
        .expect((res: request.Response) => {
          expect(res.body.success).toEqual(true);
          expect(res.body.data).toEqual(groupAchievementEmojiResponse);
        });
    });

    it('그룹 도전기록에 이모지를 성공적으로 토글하면 200을 반환한다.', async () => {
      const { accessToken } = await authFixture.getAuthenticatedUser('ABC');

      const groupAchievementEmojiResponse = GroupAchievementEmojiResponse.of(
        Emoji.SMILE,
        false,
      );

      when(
        mockGroupAchievementEmojiService.toggleAchievementEmoji(
          anyOfClass(User),
          1004,
          1005,
          Emoji.SMILE,
        ),
      ).thenResolve(groupAchievementEmojiResponse);

      // when
      // then
      return request(app.getHttpServer())
        .post(`/api/v1/groups/1004/achievements/1005/emojis/SMILE`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(201)
        .expect((res: request.Response) => {
          expect(res.body.success).toEqual(true);
          expect(res.body.data).toEqual(groupAchievementEmojiResponse);
        });
    });

    it('그룹 도전기록에 지원하지 않는 이모지를 토글하면 400을 반환한다.', async () => {
      const { accessToken } = await authFixture.getAuthenticatedUser('ABC');
      // when
      // then
      return request(app.getHttpServer())
        .post(`/api/v1/groups/1004/achievements/1004/emojis/HI`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(400)
        .expect((res: request.Response) => {
          expect(res.body.success).toEqual(false);
          expect(res.body.message).toEqual('알맞지 않은 이모지입니다.');
        });
    });

    it('그룹 도전기록에 지원하지 않는 이모지를 토글하면 400을 반환한다.', async () => {
      const { accessToken } = await authFixture.getAuthenticatedUser('ABC');
      // when
      // then
      return request(app.getHttpServer())
        .post(`/api/v1/groups/1004/achievements/1004/emojis/1`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(400)
        .expect((res: request.Response) => {
          expect(res.body.success).toEqual(false);
          expect(res.body.message).toEqual('알맞지 않은 이모지입니다.');
        });
    });

    it('그룹과 그룹 달성기록이 매칭되지 않으면 403을 반환한다.', async () => {
      const { accessToken } = await authFixture.getAuthenticatedUser('ABC');

      when(
        mockGroupAchievementEmojiService.toggleAchievementEmoji(
          anyOfClass(User),
          1004,
          1006,
          Emoji.SMILE,
        ),
      ).thenThrow(new UnauthorizedAchievementException());

      // when
      // then
      return request(app.getHttpServer())
        .post(`/api/v1/groups/1004/achievements/1006/emojis/SMILE`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(403)
        .expect((res: request.Response) => {
          expect(res.body.success).toEqual(false);
          expect(res.body.message).toEqual('달성기록에 접근할 수 없습니다.');
        });
    });

    it('그룹에 속하지 않은 사용자의 이모지 요청시 400을 반환한다.', async () => {
      const { accessToken } = await authFixture.getAuthenticatedUser('ABC');

      when(
        mockGroupAchievementEmojiService.toggleAchievementEmoji(
          anyOfClass(User),
          1004,
          1007,
          Emoji.SMILE,
        ),
      ).thenThrow(new NoSuchGroupUserException());

      // when
      // then
      return request(app.getHttpServer())
        .post(`/api/v1/groups/1004/achievements/1007/emojis/SMILE`)
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
        .post(`/api/v1/groups/1004/achievements/1007/emojis/SMILE`)
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
        .post(`/api/v1/groups/1004/achievements/1007/emojis/SMILE`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(401)
        .expect((res: request.Response) => {
          expect(res.body.success).toBe(false);
          expect(res.body.message).toBe('만료된 토큰입니다.');
        });
    });
  });
});
