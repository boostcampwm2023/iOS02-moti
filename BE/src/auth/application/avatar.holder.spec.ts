import { ConfigService } from '@nestjs/config';
import { AvatarHolder } from './avatar.holder';

describe('AvatarHolder Test', () => {
  test('기본 avatarUrl을 환경변수로 부터 가져온다.', () => {
    //given
    //when
    const configService = new ConfigService({
      USER_AVATAR_URLS: 'url1,url2,url3,url4,url5',
    });
    const avatarHolder: AvatarHolder = new AvatarHolder(configService);

    //then
    expect(avatarHolder.getUrls()).toEqual([
      'url1',
      'url2',
      'url3',
      'url4',
      'url5',
    ]);
    expect(avatarHolder.getUrls()).toContain(avatarHolder.getUrl());
  });
});
