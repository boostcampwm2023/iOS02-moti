import { IdentityToken } from '../../src/auth/application/identity-token';
import { JwtUtils } from '../../src/auth/application/jwt-utils';
import { IOauthHandler, PublicKey } from '../../src/auth';
import { Injectable } from '@nestjs/common';

@Injectable()
export class StubOauthHandler implements IOauthHandler {
  private readonly publicKey: PublicKey = {
    kid: 'stub',
    use: 'sig',
    alg: 'RS256',
    kty: 'RSA',
    n: 'xIx1bKgskF3glRqnLmjbcmEGNNZkc3TxO8peJAuVLBJSHi26DW_C-eUvvvODh19KYeNi55rxVwmTuJYoIlhBZU4mASYGKdG2nGcVRsBGzW_cZEvnVgILJpzeMTbWXe62NPQ2RvSiLRpjYhNf7WDFPivUjGoyWaiocO0kWxYVyRF4LeVhK25dutt73plrJ-sSh0VZLX12hVyKNAh4HNAWaUCVSFKNTG4vt9jCx1dn6pPQbNG_ipngLuh1dej4semVFOluoaH7BWDiiDZkT2zaPvwdQZbAEitPVcoVIV5WembYxWQzZ2PcLQV14aljF1zrqKIDsxA6pGQcf2bsbhtmVQ',
    e: 'AQAB',
  };
  constructor(private readonly jwtUtils: JwtUtils) {}
  async getUserIdentifier(token: string): Promise<string> {
    const identityToken = new IdentityToken(token);
    this.jwtUtils.validate(identityToken.jwt, this.publicKey);
    const payloads = this.jwtUtils.parsePayloads(identityToken.jwt);
    return payloads['sub'];
  }
}
