import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GroupAvatarHolder {
  private readonly defaultAvatarUrls: string[];
  constructor(configService: ConfigService) {
    const rawAvatarUrls = configService.get<string>('GROUP_AVATAR_URLS');
    this.defaultAvatarUrls = rawAvatarUrls.split(',');
  }

  getUrls() {
    return this.defaultAvatarUrls;
  }

  getUrl() {
    const idx = Math.floor(Math.random() * this.defaultAvatarUrls.length);
    return this.defaultAvatarUrls[idx];
  }
}
