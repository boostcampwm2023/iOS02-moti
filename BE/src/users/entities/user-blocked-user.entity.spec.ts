import { UsersFixture } from '../../../test/user/users-fixture';
import { UserBlockedUser } from '../domain/user-blocked-user.domain';
import { UserBlockedUserEntity } from './user-blocked-user.entity';
import { UserEntity } from './user.entity';

describe('UserBlockedUserEntity Test', () => {
  describe('from으로 UserBlockedUser에 대한 UserBlockedUserEntity를 만들 수 있다.', () => {
    it('user와 blockedUser를 모두 가지고 있는 경우에 변환이 가능하다.', () => {
      // given
      const user = UsersFixture.user('ABC');
      user.id = 1;
      const blockedUser = UsersFixture.user('DEF');
      blockedUser.id = 2;
      const userBlockedUser = new UserBlockedUser(user, blockedUser);

      // when
      const userBlockedUserEntity = UserBlockedUserEntity.from(userBlockedUser);

      // then
      expect(userBlockedUserEntity).toBeInstanceOf(UserBlockedUserEntity);
      expect(userBlockedUserEntity.user).toEqual(UserEntity.from(user));
      expect(userBlockedUserEntity.userId).toEqual(1);
      expect(userBlockedUserEntity.blockedUser).toEqual(
        UserEntity.from(blockedUser),
      );
      expect(userBlockedUserEntity.blockedUserId).toEqual(2);
    });

    it('user와 blockedUser가 없는 경우에도 변환이 가능하다.(proxy 로딩용)', () => {
      // given
      const userBlockedUser = new UserBlockedUser(null, null);

      // when
      const userBlockedUserEntity = UserBlockedUserEntity.from(userBlockedUser);

      // then
      expect(userBlockedUserEntity).toBeInstanceOf(UserBlockedUserEntity);
      expect(userBlockedUserEntity.user).toBeNull();
      expect(userBlockedUserEntity.userId).toBeNull();
      expect(userBlockedUserEntity.blockedUser).toBeNull();
      expect(userBlockedUserEntity.blockedUserId).toBeNull();
    });
  });

  describe('toModel으로 UserBlockedUserEntity를 UserBlockedUser 도메인 객체로 변환할 수 있다.', () => {
    it('user와 blockedUser를 모두 가지고 있는 경우에 변환이 가능하다.', () => {
      // given
      const user = UserEntity.from(UsersFixture.user('ABC'));
      const blockedUser = UserEntity.from(UsersFixture.user('DEF'));
      const userBlockedUserEntity = new UserBlockedUserEntity();

      userBlockedUserEntity.user = user;
      userBlockedUserEntity.blockedUser = blockedUser;

      // when
      const userBlockedUser = userBlockedUserEntity.toModel();

      // then
      expect(userBlockedUser).toBeInstanceOf(UserBlockedUser);
      expect(userBlockedUser.user).toEqual(user.toModel());
      expect(userBlockedUser.blockedUser).toEqual(blockedUser.toModel());
    });

    it('user와 blockedUser가 없는 경우에도 변환이 가능하다.', () => {
      // given
      const userBlockedUserEntity = new UserBlockedUserEntity();

      // when
      const userBlockedUser = userBlockedUserEntity.toModel();

      // then
      expect(userBlockedUser).toBeInstanceOf(UserBlockedUser);
      expect(userBlockedUser.user).toBeNull();
      expect(userBlockedUser.blockedUser).toBeNull();
    });
  });
});
