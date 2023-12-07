import { ConfigService } from '@nestjs/config';
import { GroupAvatarHolder } from './group-avatar.holder';

describe('GroupAvatarHolder Test', () => {
  test('기본 group avatarUrl을 환경변수로 부터 가져온다.', () => {
    //given
    //when
    const configService = new ConfigService({
      GROUP_AVATAR_URLS: 'url1,url2,url3,url4,url5',
    });
    const groupAvatarHolder: GroupAvatarHolder = new GroupAvatarHolder(
      configService,
    );

    //then
    expect(groupAvatarHolder.getUrls()).toEqual([
      'url1',
      'url2',
      'url3',
      'url4',
      'url5',
    ]);
    expect(groupAvatarHolder.getUrls()).toContain(groupAvatarHolder.getUrl());
  });
});
