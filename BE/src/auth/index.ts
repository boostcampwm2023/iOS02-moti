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
