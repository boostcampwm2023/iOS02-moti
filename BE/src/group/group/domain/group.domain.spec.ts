import { User } from '../../../users/domain/user.domain';
import { Group } from './group.domain';
import { UserGroupGrade } from './user-group-grade';

describe('Group Domain Test', () => {
  test('유저를 추가할 수 있다.', () => {
    //given
    //when
    const group = new Group('Test Group', 'avatarUrl');
    const user = new User();
    group.addMember(user, UserGroupGrade.PARTICIPANT);

    //then
    expect(group.userGroups.length).toEqual(1);
    expect(group.userGroups[0].grade).toEqual(UserGroupGrade.PARTICIPANT);
    expect(group.userGroups[0].user).toEqual(user);
  });

  test('그룹 로고를 설정할 수 있다.', () => {
    //given
    //when
    const group = new Group('Test Group', null);
    group.assignAvatarUrl('https://image.site/image/group-1.jpg');

    //then
    expect(group.avatarUrl).toEqual('https://image.site/image/group-1.jpg');
  });
});
