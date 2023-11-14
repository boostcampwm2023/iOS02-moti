import { JwtUtils } from './jwt-utils';
import { JwtService } from '@nestjs/jwt';
import { PublicKey } from '../index';
import { InvalidTokenException } from '../exception/invalid-token.exception';
import { ExpiredTokenException } from '../exception/expired-token.exception';
import { ConfigService } from '@nestjs/config';

describe('jwtUtils test', () => {
  const jwtUtils = new JwtUtils(
    new JwtService(),
    new ConfigService({
      JWT_SECRET: '!@testsecret!@',
      JWT_VALIDITY: 3600000,
      REFRESH_JWT_SECRET: '!@testrefreshsecret!@',
      REFRESH_JWT_VALIDITY: 604800000,
    }),
  );

  test('publicKey로 jwt를 검증한다.', () => {
    // given
    const validIdentityToken =
      'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL2FwcGxlaWQuYXBwbGUuY29tIiwiYXVkIjoiY29tLm1vdGltYXRlLm1vdGkiLCJleHAiOjE5MjA1OTkxNjgsImlhdCI6MTY5OTYxMjczMiwic3ViIjoiMTIzNDU2LjEyNTU5ZWUxNTkyYjQ0YWY5NzA1ZmRhYmYyOGFlMzhiLjEyMzQiLCJjX2hhc2giOiJxSkd3ZEhyNEZYb055Qllobm5vQ21RIiwiYXV0aF90aW1lIjoxNjk5NjEyNzMyLCJub25jZV9zdXBwb3J0ZWQiOnRydWV9.hGOMbHw4R5poeuGb8igU15oP_oS8otDNTKqR1AGlTpxbHDs5HX848B8WA1TOqiM7sBb5zWFXPmvkRHu39DnymP83vG9Vsrc__iVRh2-mxJRd_83ligkaEY4OaqpfIChYVjKyXCKFpds4na0AasjebnZzSdZnhmIBG4nvxU8UPsNyUjHDibXRB37GJIsyCgvUmdPJeTNszxQtZZnMAGy9RYSXmeX2-7OeA15QBneY1PJk3vnaBdlmLiChR4FpiX42271h3C-28XEjcfjnw6u4RiggmQnYcGOCGcSG-dKhaizKSanZ6bti21qNAAFW4R2BVRy8E65wndKagI3J_ENMQQ';

    const publicKey: PublicKey = {
      kty: 'RSA',
      kid: 'fh6Bs8C',
      use: 'sig',
      alg: 'RS256',
      n: 'zhI_awcyvJ6eJx8_qn0oiCnS4wnIL61EV_ydm8nTjgK6_rZNjlCV2bKi39Ok_OwbSFF0dRRY2YmiZvOyD6lf3K2aK73q9JRK76XyIvEcfx6g1kr8p4XHypc8Zjp-XMer7Ye6B6G9JELXlCTy0jouTNFvc2ASdUk2TMQKIepEa-c6Cxw66HAIM3sAquXEGe5pPxCYgX3uCgbdZvDZ3w33j0PTjz-y9WwqKz5eUhfQ57pSkrVFwo6WBqXEuQ0IWEQ01f_KJrMWHM36EdLh_zLAoeGTs1vriQB7A_UOI2_AufKjm7th0Qd5lma_dbuC2gzbbiFCgx19zw4Lb1EEBVakfw',
      e: 'AQAB',
    };

    // when & then
    jwtUtils.validate(validIdentityToken, publicKey);
  });

  test('만료된 토큰인 경우 ExpiredTokenExceptionException 에러를 던진다.', () => {
    // given
    const expiredIdentityToken =
      'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL2FwcGxlaWQuYXBwbGUuY29tIiwiYXVkIjoiY29tLm1vdGltYXRlLm1vdGkiLCJleHAiOjE2OTk2MTI3MzIsImlhdCI6MTY5OTYxMjczMiwic3ViIjoiMTIzNDU2LjEyNTU5ZWUxNTkyYjQ0YWY5NzA1ZmRhYmYyOGFlMzhiLjEyMzQiLCJjX2hhc2giOiJxSkd3ZEhyNEZYb055Qllobm5vQ21RIiwiYXV0aF90aW1lIjoxNjk5NjEyNzMyLCJub25jZV9zdXBwb3J0ZWQiOnRydWV9.piDCJw_KVoQqiYgYIfZ0FuoCvj6QYXMt4OV-QuqqsXt7WcMR2CQR6LOOIzscxRPCeWOdfyKaFoVEmm9fZB9G4CHvTlTLRtmWY8PxX14ZSwHv6qjCRoiNW4ruLVWrO4CDfZR3IyhyecWb-RtIeA4SIHTmtmOxpHMwzymuzFwuR6H8_ay-lXU2lLMDAPJvoHHKB_jhQedgLiPhrJAoBBnC5qoD9Z6wttRoRZzyLqEinslPJkFbGVjH-sHXmDfXT3Np-W7PqdWIEqD6hIUVjR8A51IaPMpVKnOV9Z1oxnhD80UaJNFLetlNs9Qj5zU-VLYgSSi8t9vPGav4KxsA3X4ptg';

    const publicKey: PublicKey = {
      kty: 'RSA',
      kid: 'fh6Bs8C',
      use: 'sig',
      alg: 'RS256',
      n: 'zhI_awcyvJ6eJx8_qn0oiCnS4wnIL61EV_ydm8nTjgK6_rZNjlCV2bKi39Ok_OwbSFF0dRRY2YmiZvOyD6lf3K2aK73q9JRK76XyIvEcfx6g1kr8p4XHypc8Zjp-XMer7Ye6B6G9JELXlCTy0jouTNFvc2ASdUk2TMQKIepEa-c6Cxw66HAIM3sAquXEGe5pPxCYgX3uCgbdZvDZ3w33j0PTjz-y9WwqKz5eUhfQ57pSkrVFwo6WBqXEuQ0IWEQ01f_KJrMWHM36EdLh_zLAoeGTs1vriQB7A_UOI2_AufKjm7th0Qd5lma_dbuC2gzbbiFCgx19zw4Lb1EEBVakfw',
      e: 'AQAB',
    };

    // when & then
    expect(() => jwtUtils.validate(expiredIdentityToken, publicKey)).toThrow(
      ExpiredTokenException,
    );
  });

  test('변조된 토큰인 경우 InvalidTokenException 에러를 던진다.', () => {
    // given
    const invalidIdentityToken =
      'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL2FwcGxlaWQuYXBwbGUuY29tIiwiYXVkIjoiY29tLm1vdGltYXRlLm1vdGkiLCJleHAiOjE5MjA1OTkxNjgsImlhdCI6MTY5OTYxMjczMiwic3ViIjoiMTIzNDU2LjEyNTU5ZWUxNTkyYjQ0YWY5NzA1ZmRhYmYyOGFlMzhiLjEyMzQiLCJjX2hhc2giOiJxSkd3ZEhyNEZYb055Qllobm5vQ21RIiwiYXV0aF90aW1lIjoxNjk5NjEyNzMyLCJub25jZV9zdXBwb3J0ZWQiOnRydWV9.hGOMbHw4R5poeuGb8igU15oP_oS8otDNTKqR1AGlTpxbHDs5HX848B8WA1TOqiM7sBb5zWFXPmvkRHu39DnymP83vG9Vsrc__iVRh2-mxJRd_83ligkaEY4OaqpfIChYVjKyXCKFpds4na0AasjebnZzSdZnhmIBG4nvxU8UPsNyUjHDibXRB37GJIsyCgvUmdPJeTNszxQtZZnMAGy9RYSXmeX2-7OeA15QBneY1PJk3vnaBdlmLiChR4FpiX42271h3C-28XEjcfjnw6u4RiggmQnYcGOCGcSG-dKhaizKSanZ6bti21qNAAFW4R2BVRy8E65wndKagI3J_ENMQL';

    const publicKey: PublicKey = {
      kty: 'RSA',
      kid: 'fh6Bs8C',
      use: 'sig',
      alg: 'RS256',
      n: 'zhI_awcyvJ6eJx8_qn0oiCnS4wnIL61EV_ydm8nTjgK6_rZNjlCV2bKi39Ok_OwbSFF0dRRY2YmiZvOyD6lf3K2aK73q9JRK76XyIvEcfx6g1kr8p4XHypc8Zjp-XMer7Ye6B6G9JELXlCTy0jouTNFvc2ASdUk2TMQKIepEa-c6Cxw66HAIM3sAquXEGe5pPxCYgX3uCgbdZvDZ3w33j0PTjz-y9WwqKz5eUhfQ57pSkrVFwo6WBqXEuQ0IWEQ01f_KJrMWHM36EdLh_zLAoeGTs1vriQB7A_UOI2_AufKjm7th0Qd5lma_dbuC2gzbbiFCgx19zw4Lb1EEBVakfw',
      e: 'AQAB',
    };

    // when & then
    expect(() => jwtUtils.validate(invalidIdentityToken, publicKey)).toThrow(
      InvalidTokenException,
    );
  });

  test('IdentityToken에서 payloads를 파싱한다. ', () => {
    // given
    const identityToken =
      'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL2FwcGxlaWQuYXBwbGUuY29tIiwiYXVkIjoiY29tLm1vdGltYXRlLm1vdGkiLCJleHAiOjE5MjA1OTkxNjgsImlhdCI6MTY5OTYxMjczMiwic3ViIjoiMTIzNDU2LjEyNTU5ZWUxNTkyYjQ0YWY5NzA1ZmRhYmYyOGFlMzhiLjEyMzQiLCJjX2hhc2giOiJxSkd3ZEhyNEZYb055Qllobm5vQ21RIiwiYXV0aF90aW1lIjoxNjk5NjEyNzMyLCJub25jZV9zdXBwb3J0ZWQiOnRydWV9.hGOMbHw4R5poeuGb8igU15oP_oS8otDNTKqR1AGlTpxbHDs5HX848B8WA1TOqiM7sBb5zWFXPmvkRHu39DnymP83vG9Vsrc__iVRh2-mxJRd_83ligkaEY4OaqpfIChYVjKyXCKFpds4na0AasjebnZzSdZnhmIBG4nvxU8UPsNyUjHDibXRB37GJIsyCgvUmdPJeTNszxQtZZnMAGy9RYSXmeX2-7OeA15QBneY1PJk3vnaBdlmLiChR4FpiX42271h3C-28XEjcfjnw6u4RiggmQnYcGOCGcSG-dKhaizKSanZ6bti21qNAAFW4R2BVRy8E65wndKagI3J_ENMQQ';

    // when
    const payloads = jwtUtils.parsePayloads(identityToken);

    // then
    expect(payloads['sub']).toEqual(
      '123456.12559ee1592b44af9705fdabf28ae38b.1234',
    );
  });

  test('access token을 발급한다.', () => {
    // given
    const claims = { userCode: 'A1B2C3D' };
    const issuedAt = new Date('2023-10-25T10:00:00');
    const accessToken = jwtUtils.createToken(claims, issuedAt);

    // when & then
    expect(accessToken).toEqual(
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyQ29kZSI6IkExQjJDM0QiLCJpYXQiOjE2OTgxOTU2MDAsImV4cCI6MTY5ODE5OTIwMH0.32XL-boBJVJjypbBTNCIM7Y_OyXynkBJQWHdjZqDhgU',
    );
    expect(jwtUtils.parsePayloads(accessToken)).toEqual({
      exp: 1698199200,
      iat: 1698195600,
      userCode: 'A1B2C3D',
    });
  });

  test('만료된 access token인 경우 ExpiredTokenExceptionException 에러를 던진다.', () => {
    // given
    const claims = { userCode: 'A1B2C3D' };
    const issuedAt = new Date('2022-10-25T10:00:00');
    const expiredAccessToken = jwtUtils.createToken(claims, issuedAt);

    // when & then
    expect(() => jwtUtils.validateToken(expiredAccessToken)).toThrow(
      ExpiredTokenException,
    );
  });

  test('변조된 access token인 경우 InvalidTokenException 에러를 던진다.', () => {
    // given
    const invalidAccessToken =
      'ayJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWRlbnRpZmllciI6InNlaHllb25nIiwiaWF0IjoxNjk4MTk1NjAwLCJleHAiOjE2OTgxOTkyMDB9.GpLoCMUHISM4oik5_Ar9izFNdUGBLMKf4uh0GLUqMtY';

    // when & then
    expect(() => jwtUtils.validateToken(invalidAccessToken)).toThrow(
      InvalidTokenException,
    );
  });

  test('refresh token을 발급한다.', () => {
    // given
    const claims = { userCode: 'A1B2C3D' };
    const issuedAt = new Date('2023-10-25T10:00:00');

    const refreshToken = jwtUtils.createRefreshToken(claims, issuedAt);

    // when & then
    expect(refreshToken).toEqual(
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyQ29kZSI6IkExQjJDM0QiLCJpYXQiOjE2OTgxOTU2MDAsImV4cCI6MTY5ODgwMDQwMH0.5k90PFImx0_67KcSmxLpMyysIWlL5RyWZNDhegIxPoA',
    );
    expect(jwtUtils.parsePayloads(refreshToken)).toEqual({
      exp: 1698800400,
      iat: 1698195600,
      userCode: 'A1B2C3D',
    });
  });

  test('만료된 refresh token인 경우 ExpiredTokenExceptionException 에러를 던진다.', () => {
    // given
    const claims = { userCode: 'A1B2C3D' };
    const issuedAt = new Date('2022-10-25T10:00:00');
    const expiredRefreshToken = jwtUtils.createRefreshToken(claims, issuedAt);

    // when & then
    expect(() => jwtUtils.validateRefreshToken(expiredRefreshToken)).toThrow(
      ExpiredTokenException,
    );
  });

  test('변조된 refresh token인 경우 InvalidTokenException 에러를 던진다.', () => {
    // given
    const InvalidRefreshToken =
      'ayJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWRlbnRpZmllciI6InNlaHllb25nIiwiaWF0IjoxNjk4MTk1NjAwLCJleHAiOjE2OTgxOTkyMDB9.p9gJmNmunOKRh6KBj0gZM-PcxO2auuZ7TMd7sfSTF_s';

    // when & then
    expect(() => jwtUtils.validateRefreshToken(InvalidRefreshToken)).toThrow(
      InvalidTokenException,
    );
  });
});
