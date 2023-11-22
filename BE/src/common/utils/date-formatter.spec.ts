import { dateFormat } from './date-formatter';

describe('DateFormatter', () => {
  it('날짜 포맷이 적용되어야 한다.', () => {
    // given
    const date = new Date('2021-01-01T00:00:00.000Z');

    // when
    const formattedDate = dateFormat(date);

    // then
    expect(formattedDate).toBe('2021-01-01T00:00:00Z');
  });

  it('날짜 포맷이 적용되어야 한다.', () => {
    // given
    // when
    const formattedDate = dateFormat(undefined);

    // then
    expect(formattedDate).toBeNull();
  });
});
