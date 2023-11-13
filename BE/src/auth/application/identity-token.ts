import { InvalidTokenException } from '../exception/invalid-token.exception';

interface IdentityTokenHeader {
  kid: string;
  alg: string;
}
interface IdentityTokenPayload {
  iss: string;
  aud: string;
  exp: number;
  iat: number;
  sub: string;
  c_hash: string;
  auth_time: number;
  nonce_supported: boolean;
}
export class IdentityToken {
  header: IdentityTokenHeader;
  payload: IdentityTokenPayload;
  signature: string;
  jwt: string;
  constructor(token: string) {
    this.jwt = token;
    const [header, payload, signature] = token.split('.');
    this.header = this.base64UrlDecode(header);
    this.payload = this.base64UrlDecode(payload);
    this.signature = signature;
  }

  private base64UrlDecode(base64Url: string) {
    while (base64Url.length % 4 !== 0) {
      base64Url += '=';
    }
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonString = atob(base64);
    try {
      return JSON.parse(jsonString);
    } catch (e) {
      throw new InvalidTokenException();
    }
  }
}
