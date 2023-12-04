import { OauthRequester } from './oauth-requester';
import { Injectable } from '@nestjs/common';
import { IdentityToken } from './identity-token';
import { JwtUtils } from './jwt-utils';
import { IOauthHandler, PublicKey } from '../index';

@Injectable()
export class OauthHandler implements IOauthHandler {
  constructor(
    private readonly oauthRequester: OauthRequester,
    private readonly jwtUtils: JwtUtils,
  ) {}
  async getUserIdentifier(token: string): Promise<string> {
    const identityToken = new IdentityToken(token);
    const publicKeys = await this.oauthRequester.getPublicKeys();
    const publicKey = publicKeys.keys.find(
      (key) => key.kid === identityToken.header.kid,
    );
    this.validateIdentityToken(identityToken.jwt, publicKey);
    const payloads = this.jwtUtils.parsePayloads(identityToken.jwt);
    return payloads['sub'];
  }
  private validateIdentityToken(identityToken: string, publicKey: PublicKey) {
    this.jwtUtils.validate(identityToken, publicKey);
  }
}
