import { NamingStrategyInterface } from 'typeorm';
import { CamelSnakeNameStrategy } from './camel-snake-name-strategy';

describe('CamelSnakeNameStrategy Test', () => {
  let stragegy: NamingStrategyInterface;

  beforeAll(() => {
    stragegy = new CamelSnakeNameStrategy();
  });

  it('camelCase인 테이블 이름을 snakeCase로 변경할 수 있다.', () => {
    // given
    const camelCase = 'UserPostComment';

    // when
    const transformed = stragegy.tableName(camelCase, undefined);

    // then
    expect(transformed).toBe('user_post_comment');
  });

  it('테이블 이름에 커스텀 이름이 등록되어 있으면 해당 strategy가 동작하지 않는다.', () => {
    // given
    const camelCase = 'UserPostComment';

    // when
    const transformed = stragegy.tableName(camelCase, 'USER_POST_COMMENT');

    // then
    expect(transformed).toBe('USER_POST_COMMENT');
  });

  it('camelCase인 프로퍼티 이름을 snakeCase로 변경할 수 있다.', () => {
    // given
    const camelCase = 'userAddressPostCode';

    // when
    const transformed = stragegy.columnName(camelCase, undefined, []);

    // then
    expect(transformed).toBe('user_address_post_code');
  });

  it('프로퍼티에 커스텀 이름이 등록되어 있으면 해당 strategy가 동작하지 않는다.', () => {
    // given
    const camelCase = 'userAddressPostCode';

    // when
    const transformed = stragegy.columnName(
      camelCase,
      'USER_ADDRESS_POST_CODE',
      [],
    );

    // then
    expect(transformed).toBe('USER_ADDRESS_POST_CODE');
  });

  it('임베디드 타입이 적용된 프로퍼티는 _ 를 통해 SnakeCase로 이어진다.', () => {
    // given
    const camelCase = 'Street';

    // when
    const transformed = stragegy.columnName(camelCase, undefined, ['Address']);

    // then
    expect(transformed).toBe('address_street');
  });

  it('커스텀 네임이 적용된 프로퍼티라도 _ 를 통해 이어지고 이름전략이 적용되지 않는다.', () => {
    // given
    const camelCase = 'Street';

    // when
    const transformed = stragegy.columnName(camelCase, 'STREET', ['Address']);

    // then
    expect(transformed).toBe('Address_STREET');
  });

  it('연관관계이름은 camelCase에서 snakeCase로 변경된다.', () => {
    // given
    const camelCase = 'userPhoto';

    // when
    const transformed = stragegy.relationName(camelCase);

    // then
    expect(transformed).toBe('user_photo');
  });
});
