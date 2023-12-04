export interface PublicKey {
  kty: string;
  kid: string;
  use: string;
  alg: string;
  n: string;
  e: string;
}
export interface PublicKeysResponse {
  keys: PublicKey[];
}

export interface JwtClaim {
  userCode: string;
}
export interface JwtRolePayloads extends JwtClaim {
  roles: string[];
}

export type Payload = { iat: number; exp: number } & JwtClaim;

export interface IOauthHandler {
  getUserIdentifier(token: string): Promise<string>;
}
