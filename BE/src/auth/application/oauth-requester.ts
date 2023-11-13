import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { PublicKeysResponse } from '../index';
import { FetchPublicKeyException } from '../exception/fetch-public-key.exception';

@Injectable()
export class OauthRequester {
  private readonly applePublicKeyUrl: string;
  private readonly httpService: HttpService;

  constructor(configService: ConfigService, httpService: HttpService) {
    this.applePublicKeyUrl = configService.get<string>('APPLE_PUBLIC_KEY_URL');
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
}
