import { Injectable } from '@nestjs/common';
import { JsonWebTokenError, JwtService, TokenExpiredError } from '@nestjs/jwt';
import { JwtClaim, Payload, PublicKey } from '../index';
import { createPublicKey } from 'crypto';
import { InvalidTokenException } from '../exception/invalid-token.exception';
import { ExpiredTokenException } from '../exception/expired-token.exception';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtUtils {
  private readonly secretKey: string;
  private readonly validityInMilliseconds: number;
  private readonly refreshSecretKey: string;
  private readonly refreshValidityInMilliseconds: number;
  constructor(
    private readonly jwtService: JwtService,
    configService: ConfigService,
  ) {
    this.secretKey = configService.get<string>('JWT_SECRET');
    this.refreshSecretKey = configService.get<string>('REFRESH_JWT_SECRET');
    this.validityInMilliseconds = configService.get<number>('JWT_VALIDITY');
    this.refreshValidityInMilliseconds = configService.get<number>(
      'REFRESH_JWT_VALIDITY',
    );
  }

  createToken(claim: JwtClaim, from: Date) {
    const issuedAt = Math.floor(from.getTime() / 1000);
    const validity = Math.floor(
      new Date(from.getTime() + this.validityInMilliseconds).getTime() / 1000,
    );
    const payload: Payload = {
      ...claim,
      iat: issuedAt,
      exp: validity,
    };
    return this.jwtService.sign(payload, { secret: this.secretKey });
  }

  validateToken(token: string) {
    try {
      this.jwtService.verify(token, { secret: this.secretKey });
    } catch (err) {
      if (err instanceof TokenExpiredError) {
        throw new ExpiredTokenException();
      }
      if (err instanceof JsonWebTokenError) {
        throw new InvalidTokenException();
      }
    }
  }

  createRefreshToken(claim: JwtClaim, from: Date) {
    const issuedAt = Math.floor(from.getTime() / 1000);
    const validity = Math.floor(
      new Date(from.getTime() + this.refreshValidityInMilliseconds).getTime() /
        1000,
    );
    const payload: Payload = {
      ...claim,
      iat: issuedAt,
      exp: validity,
    };
    return this.jwtService.sign(payload, { secret: this.refreshSecretKey });
  }
  validateRefreshToken(token: string) {
    try {
      this.jwtService.verify(token, { secret: this.refreshSecretKey });
    } catch (err) {
      if (err instanceof TokenExpiredError) {
        throw new ExpiredTokenException();
      }
      if (err instanceof JsonWebTokenError) {
        throw new InvalidTokenException();
      }
    }
  }

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
