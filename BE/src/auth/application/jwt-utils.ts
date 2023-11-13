import { Injectable } from '@nestjs/common';
import { JsonWebTokenError, JwtService, TokenExpiredError } from '@nestjs/jwt';
import { PublicKey } from '../index';
import { createPublicKey } from 'crypto';
import { InvalidTokenException } from '../exception/invalid-token.exception';
import { ExpiredTokenException } from '../exception/expired-token.exception';

@Injectable()
export class JwtUtils {
  constructor(private readonly jwtService: JwtService) {}

  validate(token: string, publicKey: PublicKey) {
    try {
      this.jwtService.verify(token, {
        publicKey: this.toPemFormat(publicKey),
        algorithms: ['RS256'],
      });
    } catch (err) {
      if (err instanceof TokenExpiredError) {
        throw new ExpiredTokenException();
      }
      if (err instanceof JsonWebTokenError) {
        throw new InvalidTokenException();
      }
    }
  }

  parsePayloads(token: string) {
    return this.jwtService.decode(token);
  }

  private toPemFormat(publicKey: PublicKey) {
    const publicKeyJwkFormat = createPublicKey({
      format: 'jwk',
      key: {
        kty: publicKey.kty,
        n: publicKey.n,
        e: publicKey.e,
      },
    });
    return publicKeyJwkFormat.export({
      format: 'pem',
      type: 'spki',
    });
  }
}
