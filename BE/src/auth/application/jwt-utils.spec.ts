import { JwtUtils } from './jwt-utils';
import { JwtService } from '@nestjs/jwt';
import { PublicKey } from '../index';
import { ExpiredTokenExceptionException } from '../exception/ExpiredTokenExceptionException';
import { InvalidTokenException } from '../exception/InValidTokenException.exception';

describe('jwtUtils test', () => {
  const jwtUtils = new JwtUtils(new JwtService());

  test('publicKey로 jwt를 검증한다.', () => {
    // given
    const identityToken =
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
    jwtUtils.validate(identityToken, publicKey);
  });

  test('만료된 토큰인 경우 ExpiredTokenExceptionException 에러를 던진다.', () => {
    // given
    const identityToken =
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
    expect(() => jwtUtils.validate(identityToken, publicKey)).toThrow(
      ExpiredTokenExceptionException,
    );
  });

  test('변조된 토큰인 경우 InvalidTokenException 에러를 던진다.', () => {
    // given
    const identityToken =
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
    expect(() => jwtUtils.validate(identityToken, publicKey)).toThrow(
      InvalidTokenException,
    );
  });

  test('IdentityToken에서 payloads를 파싱한다. ', () => {
    // given
    const jwtUtils = new JwtUtils(new JwtService());
    const identityToken =
      'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL2FwcGxlaWQuYXBwbGUuY29tIiwiYXVkIjoiY29tLm1vdGltYXRlLm1vdGkiLCJleHAiOjE5MjA1OTkxNjgsImlhdCI6MTY5OTYxMjczMiwic3ViIjoiMTIzNDU2LjEyNTU5ZWUxNTkyYjQ0YWY5NzA1ZmRhYmYyOGFlMzhiLjEyMzQiLCJjX2hhc2giOiJxSkd3ZEhyNEZYb055Qllobm5vQ21RIiwiYXV0aF90aW1lIjoxNjk5NjEyNzMyLCJub25jZV9zdXBwb3J0ZWQiOnRydWV9.hGOMbHw4R5poeuGb8igU15oP_oS8otDNTKqR1AGlTpxbHDs5HX848B8WA1TOqiM7sBb5zWFXPmvkRHu39DnymP83vG9Vsrc__iVRh2-mxJRd_83ligkaEY4OaqpfIChYVjKyXCKFpds4na0AasjebnZzSdZnhmIBG4nvxU8UPsNyUjHDibXRB37GJIsyCgvUmdPJeTNszxQtZZnMAGy9RYSXmeX2-7OeA15QBneY1PJk3vnaBdlmLiChR4FpiX42271h3C-28XEjcfjnw6u4RiggmQnYcGOCGcSG-dKhaizKSanZ6bti21qNAAFW4R2BVRy8E65wndKagI3J_ENMQQ';

    // when
    const payloads = jwtUtils.parsePayloads(identityToken);

    // then
    expect(payloads['sub']).toEqual(
      '123456.12559ee1592b44af9705fdabf28ae38b.1234',
    );
  });
});
