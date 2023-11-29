import { User } from '../../../users/domain/user.domain';
import { Group } from './group.domain';
import { UserGroupGrade } from './user-group-grade';

describe('Group Domain Test', () => {
  test('유저를 추가할 수 있다.', () => {
    const group = new Group('Test Group', 'avatarUrl');
    const user = new User();
    group.addMember(user, UserGroupGrade.PARTICIPANT);

    expect(group.userGroups.length).toEqual(1);
    expect(group.userGroups[0].grade).toEqual(UserGroupGrade.PARTICIPANT);
    expect(group.userGroups[0].user).toEqual(user);
  });
});
