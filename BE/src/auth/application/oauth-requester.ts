import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { PublicKeysResponse } from '../index';
import { FetchPublicKeyException } from '../exception/fetch-public-key.exception';
import { FetchAccessTokenException } from '../exception/fetch-access-token.exception';
import { RevokeRequestFailException } from '../exception/revoke-request-fail.exception';

@Injectable()
export class OauthRequester {
  private readonly applePublicKeyUrl: string;
  private readonly appleTokenUrl: string;
  private readonly appleRevokeUrl: string;
  private readonly clientId: string;
  private readonly httpService: HttpService;

  constructor(configService: ConfigService, httpService: HttpService) {
    this.applePublicKeyUrl = configService.get<string>('APPLE_PUBLIC_KEY_URL');
    this.appleTokenUrl = configService.get<string>('APPLE_TOKEN_URL');
    this.appleRevokeUrl = configService.get<string>('APPLE_REVOKE_URL');
    this.clientId = configService.get<string>('APPLE_CLIENT_ID');
    this.httpService = httpService;
  }
  async getPublicKeys(): Promise<PublicKeysResponse> {
    try {
      const res = await this.httpService.axiosRef.get(this.applePublicKeyUrl);
      return res.data;
    } catch (err) {
      throw new FetchPublicKeyException();
    }
  }

  async getAccessToken(clientSecret: string, authorizationCode: string) {
    const payload = {
      code: authorizationCode,
      client_id: this.clientId,
      grant_type: 'authorization_code',
      client_secret: clientSecret,
    };
    try {
      const res = await this.httpService.axiosRef.post(
        this.appleTokenUrl,
        payload,
        {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        },
      );
      return res.data;
    } catch (err) {
      throw new FetchAccessTokenException();
    }
  }

  async revoke(clientSecret: string, refreshToken: string) {
    const payload = {
      token: refreshToken,
      client_id: this.clientId,
      client_secret: clientSecret,
    };
    try {
      return await this.httpService.axiosRef.post(
        this.appleRevokeUrl,
        payload,
        {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        },
      );
    } catch (err) {
      throw new RevokeRequestFailException();
    }
  }
}
