import { ConfigService } from '@nestjs/config';
import { BcryptPasswordEncoder } from './bcrypt-password-encoder';
import { PlainTextPasswordEncoder } from './plain-text-password-encoder';

describe('passwordEncoder Test', () => {
  describe('BcryptPasswordEncoder Test', () => {
    const passwordEncoder = new BcryptPasswordEncoder(
      new ConfigService({
        BCRYPT_SALT: 10,
      }),
    );
    it('encode는 bcrypt로 암호화 할 수 있다.', async () => {
      // given
      const password = 'password';

      // when
      const hashPassword = await passwordEncoder.encode(password);

      // then
      expect(hashPassword).not.toBe(password);
    });

    it('compare는 bcrypt로 암호화된 비밀번호를 검증할 수 있다.', async () => {
      // given
      const password = 'password';
      const hashPassword = await passwordEncoder.encode(password);

      // when
      const result = await passwordEncoder.compare(password, hashPassword);

      // then
      expect(result).toBe(true);
    });
  });

  describe('PlainTextPasswordEncoder Test', () => {
    const passwordEncoder = new PlainTextPasswordEncoder();

    it('encode는 암호화 하지 않는다.', async () => {
      // given
      const password = 'password';

      // when
      const hashPassword = await passwordEncoder.encode(password);

      // then
      expect(hashPassword).toBe(password);
    });

    it('compare는 비밀번호를 검증할 수 있다.', async () => {
      // given
      const password = 'password';
      const hashPassword = await passwordEncoder.encode(password);

      // when
      const result = await passwordEncoder.compare(password, hashPassword);

      // then
      expect(result).toBe(true);
    });
  });

  describe('passwordEncoderProviderOptions Test', () => {});
});
