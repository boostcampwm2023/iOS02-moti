import { User } from '../../users/domain/user.domain';
import { Admin } from './admin.domain';
import { AdminStatus } from './admin-status';
import { BcryptPasswordEncoder } from '../application/bcrypt-password-encoder';
import { ConfigService } from '@nestjs/config';
import { UserRole } from '../../users/domain/user-role';

describe('Admin 도메인 객체 Test', () => {
  const bcryptPasswordEncoder = new BcryptPasswordEncoder(
    new ConfigService({
      BCRYPT_SALT: 1,
    }),
  );

  it('Admin 도메인 객체를 생성할 수 있다.', () => {
    // given
    const user = User.from('123');
    user.assignUserCode('ABCEAQ2');

    // when
    const admin = new Admin(user, 'abc123@abc.com', '1234');

    // then
    expect(admin).toBeDefined();
    expect(admin.email).toBe('abc123@abc.com');
    expect(admin.password).toBe('1234');
    expect(admin.status).toBe(AdminStatus.PENDING);
    expect(admin.user).toStrictEqual(user);
  });

  it('register를 이용해 인코딩된 password로 재설정할 수 있다.', async () => {
    // given
    const user = User.from('123');
    user.assignUserCode('ABCEAQ2');
    const admin = new Admin(user, 'abc@abc.com', '1234');

    // when
    await admin.register(bcryptPasswordEncoder);

    // then
    expect(admin.password).not.toBe('1234');
  });

  it('auth는 비밀번호를 검증할 수 있다.', async () => {
    // given
    const user = User.from('123');
    user.assignUserCode('ABCEAQ2');
    const admin = new Admin(user, 'abc@abc.com', '1234');
    await admin.register(bcryptPasswordEncoder);

    // when
    const authResult = await admin.auth('1234', bcryptPasswordEncoder);

    // then
    expect(admin.password).not.toBe('1234');
    expect(authResult).toBe(true);
  });

  it('accepted는 어드민을 활성화 상태로 변경한다.', () => {
    // given
    const user = User.from('123');
    user.assignUserCode('ABCEAQ2');
    const admin = new Admin(user, 'abc@abc.com', '1234');

    // when
    admin.accepted();

    // then
    expect(admin.status).toBe(AdminStatus.ACTIVE);
    expect(admin.user.roles).toContain(UserRole.ADMIN);
  });
});
