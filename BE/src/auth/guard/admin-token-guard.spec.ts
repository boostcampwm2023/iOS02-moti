import { AdminTokenGuard } from './admin-token.guard';
import { User } from '../../users/domain/user.domain';
import { UserRole } from '../../users/domain/user-role';

describe('AdminTokenGuard Test', () => {
  const tokenGuard = new AdminTokenGuard(undefined, undefined);

  it('tokenGuard이 정의되어있다.', () => {
    expect(tokenGuard).toBeDefined();
  });

  describe('validateAdminUser는 유저에 ADMIN 권한이 있는지 확인한다.', () => {
    it('유저가 빈 값일 때 false를 반환한다.', () => {
      expect(tokenGuard.validateAdminUser(undefined)).toBeFalsy();
      expect(tokenGuard.validateAdminUser(null)).toBeFalsy();
    });

    it('유저에 ADMIN 권한이 없을 때 false를 반환한다.', () => {
      // given
      const user = new User();
      user.roles = [UserRole.MEMBER];

      // when
      const result = tokenGuard.validateAdminUser(user);

      // then
      expect(result).toBeFalsy();
    });

    it('유저에 권한이 비어있을 때 false를 반환한다.', () => {
      // given
      const user = new User();

      // when
      const result = tokenGuard.validateAdminUser(user);

      // then
      expect(result).toBeFalsy();
    });

    it('유저에 MEMBER, ADMIN 권한이 있을 때 true를 반환한다.', () => {
      // given
      const user = new User();
      user.roles = [UserRole.MEMBER, UserRole.ADMIN];

      // when
      const result = tokenGuard.validateAdminUser(user);

      // then
      expect(result).toBeTruthy();
    });

    it('유저에 ADMIN 권한이 있을 때 true를 반환한다.', () => {
      // given
      const user = new User();
      user.roles = [UserRole.ADMIN];

      // when
      const result = tokenGuard.validateAdminUser(user);

      // then
      expect(result).toBeTruthy();
    });
  });
});
