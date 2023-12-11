import { OauthRequester } from './oauth-requester';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import axios from 'axios';
import { PublicKeysResponse } from '../index';
import { FetchPublicKeyException } from '../exception/fetch-public-key.exception';
import { FetchAccessTokenException } from '../exception/fetch-access-token.exception';
import { RevokeRequestFailException } from '../exception/revoke-request-fail.exception';

describe('OauthRequester test', () => {
  const oauthRequester = new OauthRequester(
    new ConfigService(),
    new HttpService(),
  );

  test('Apple ID Server로 부터 public key를 얻어온다.', async () => {
    // given
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
          n: 'u704gotMSZc6CSSVNCZ1d0S9dZKwO2BVzfdTKYz8wSNm7R_KIufOQf3ru7Pph1FjW6gQ8zgvhnv4IebkGWsZJlodduTC7c0sRb5PZpEyM6PtO8FPHowaracJJsK1f6_rSLstLdWbSDXeSq7vBvDu3Q31RaoV_0YlEzQwPsbCvD45oVy5Vo5oBePUm4cqi6T3cZ-10gr9QJCVwvx7KiQsttp0kUkHM94PlxbG_HAWlEZjvAlxfEDc-_xZQwC6fVjfazs3j1b2DZWsGmBRdx1snO75nM7hpyRRQB4jVejW9TuZDtPtsNadXTr9I5NjxPdIYMORj9XKEh44Z73yfv0gtw',
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

    jest.spyOn(axios, 'get').mockResolvedValue({ data: mockPublicKeyResponse });

    // when
    const result = await oauthRequester.getPublicKeys();

    // then
    expect(result).toEqual(mockPublicKeyResponse);
  });

  test('public key 요청에 실패하면 FetchPublicKeyException에러를 던진다.', async () => {
    // given
    jest.spyOn(axios, 'get').mockRejectedValue(new Error('Simulated error'));

    // when & then
    await expect(oauthRequester.getPublicKeys()).rejects.toThrowError(
      FetchPublicKeyException,
    );
  });

  test('Apple ID Server로 부터 토큰(accessToken, refreshToken)를 얻어온다.', async () => {
    // given
    const tokenResponse = {
      access_token: 'access_token',
      expires_in: 1702108011,
      id_token: 'id_token',
      refresh_token: 'refresh_token',
      token_type: 'access_token',
    };

    jest.spyOn(axios, 'post').mockResolvedValue({ data: tokenResponse });

    // when
    const result = await oauthRequester.getAccessToken(
      'clientSecret',
      'authorizationCode',
    );

    // then
    expect(result).toEqual(tokenResponse);
  });

  test('토큰요청에 실패하면 FetchAccessTokenException 던진다.', async () => {
    // given
    jest.spyOn(axios, 'post').mockRejectedValue(new Error('Simulated error'));

    // when & then
    await expect(
      oauthRequester.getAccessToken('clientSecret', 'authorizationCode'),
    ).rejects.toThrowError(FetchAccessTokenException);
  });

  test('Apple ID Server에 revoke 요청을 한다.', async () => {
    // given

    jest.spyOn(axios, 'post').mockResolvedValue({ status: 200 });

    // when
    const result = await oauthRequester.revoke('clientSecret', 'refreshToken');

    // then
    expect(result.status).toEqual(200);
  });

  test('revoke요청에 실패하면 RevokeRequestFailException 던진다.', async () => {
    // given
    jest.spyOn(axios, 'post').mockRejectedValue(new Error('Simulated error'));

    // when & then
    await expect(
      oauthRequester.revoke('clientSecret', 'refreshToken'),
    ).rejects.toThrowError(RevokeRequestFailException);
  });
});
