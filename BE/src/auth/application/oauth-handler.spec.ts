import { OauthRequester } from './oauth-requester';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { JwtService } from '@nestjs/jwt';
import { PublicKeysResponse } from '../index';
import { JwtUtils } from './jwt-utils';
import { OauthHandler } from './oauth-handler';

describe('OauthHandler test', () => {
  const oauthRequester = new OauthRequester(
    new ConfigService(),
    new HttpService(),
  );
  const jwtUtils = new JwtUtils(new JwtService(), new ConfigService());
  const oauthHandler = new OauthHandler(oauthRequester, jwtUtils);

  test('apple ID 서버로 부터 public key를 가져와서 identityToken을 검증한다.', async () => {
    const mockPublicKeyResponse: PublicKeysResponse = {
      keys: [
        {
          kty: 'RSA',
          kid: 'W6WcOKB',
          use: 'sig',
          alg: 'RS256',
          n: '2Zc5d0-zkZ5AKmtYTvxHc3vRc41YfbklflxG9SWsg5qXUxvfgpktGAcxXLFAd9Uglzow9ezvmTGce5d3DhAYKwHAEPT9hbaMDj7DfmEwuNO8UahfnBkBXsCoUaL3QITF5_DAPsZroTqs7tkQQZ7qPkQXCSu2aosgOJmaoKQgwcOdjD0D49ne2B_dkxBcNCcJT9pTSWJ8NfGycjWAQsvC8CGstH8oKwhC5raDcc2IGXMOQC7Qr75d6J5Q24CePHj_JD7zjbwYy9KNH8wyr829eO_G4OEUW50FAN6HKtvjhJIguMl_1BLZ93z2KJyxExiNTZBUBQbbgCNBfzTv7JrxMw',
          e: 'AQAB',
        },
        {
          kty: 'RSA',
          kid: 'fh6Bs8C',
          use: 'sig',
          alg: 'RS256',
          n: 'zhI_awcyvJ6eJx8_qn0oiCnS4wnIL61EV_ydm8nTjgK6_rZNjlCV2bKi39Ok_OwbSFF0dRRY2YmiZvOyD6lf3K2aK73q9JRK76XyIvEcfx6g1kr8p4XHypc8Zjp-XMer7Ye6B6G9JELXlCTy0jouTNFvc2ASdUk2TMQKIepEa-c6Cxw66HAIM3sAquXEGe5pPxCYgX3uCgbdZvDZ3w33j0PTjz-y9WwqKz5eUhfQ57pSkrVFwo6WBqXEuQ0IWEQ01f_KJrMWHM36EdLh_zLAoeGTs1vriQB7A_UOI2_AufKjm7th0Qd5lma_dbuC2gzbbiFCgx19zw4Lb1EEBVakfw',
          e: 'AQAB',
        },
        {
          kty: 'RSA',
          kid: 'YuyXoY',
          use: 'sig',
          alg: 'RS256',
          n: '1JiU4l3YCeT4o0gVmxGTEK1IXR-Ghdg5Bzka12tzmtdCxU00ChH66aV-4HRBjF1t95IsaeHeDFRgmF0lJbTDTqa6_VZo2hc0zTiUAsGLacN6slePvDcR1IMucQGtPP5tGhIbU-HKabsKOFdD4VQ5PCXifjpN9R-1qOR571BxCAl4u1kUUIePAAJcBcqGRFSI_I1j_jbN3gflK_8ZNmgnPrXA0kZXzj1I7ZHgekGbZoxmDrzYm2zmja1MsE5A_JX7itBYnlR41LOtvLRCNtw7K3EFlbfB6hkPL-Swk5XNGbWZdTROmaTNzJhV-lWT0gGm6V1qWAK2qOZoIDa_3Ud0Gw',
          e: 'AQAB',
        },
      ],
    };
    jest
      .spyOn(oauthRequester, 'getPublicKeys')
      .mockResolvedValue(mockPublicKeyResponse);

    const userIdentifier = await oauthHandler.getUserIdentifier(
      'eyJraWQiOiJmaDZCczhDIiwiYWxnIjoiUlMyNTYifQ.eyJpc3MiOiJodHRwczovL2FwcGxlaWQuYXBwbGUuY29tIiwiYXVkIjoiY29tLm1vdGltYXRlLm1vdGkiLCJleHAiOjE5MjA1OTkxNjgsImlhdCI6MTY5OTYxMjczMiwic3ViIjoiMTIzNDU2LjEyNTU5ZWUxNTkyYjQ0YWY5NzA1ZmRhYmYyOGFlMzhiLjEyMzQiLCJjX2hhc2giOiJxSkd3ZEhyNEZYb055Qllobm5vQ21RIiwiYXV0aF90aW1lIjoxNjk5NjEyNzMyLCJub25jZV9zdXBwb3J0ZWQiOnRydWV9.YdK6WYDeGBskSPCARJl-OSGJ8Bo5RiO36lmo8KV2xRpf-QNbHJXakvfrEREXyxsesNQnGxD6AV0hJTNVYIC5LbDlDRP-09Kihg8RgksAseVvSNLic1Ug0sTN2Aivhmcu9GqB4s0p2Uv4E1mKcx5u5JQtu5c_6oNLrn4AmXJQrwfWebYFyuqkr0gFYaltpd4mVNrgJzuSNJdNyt6-UUefq6KYuPHsm3cIYUTZWzSLxaDV3Kr7vnxta-CFN_EHCDiA5nqRofO0jIDgcE7M8cudpejRtZ7zhzIlOE8ggGyvW3Qg-7MaMTxAaUuIivSqeY_f0GYtsiEl_ouKuWlQ1SPPNA',
    );

    expect(userIdentifier).toEqual(
      '123456.12559ee1592b44af9705fdabf28ae38b.1234',
    );
  });
});
