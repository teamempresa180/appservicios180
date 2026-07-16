import { createHash, randomUUID } from 'node:crypto';
import { Injectable } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { ConfigService } from '../../../../config/config.service';
import { UnauthorizedException } from '../../../core/domain/exceptions/unauthorized.exception';
import { TokenClaims, TokenService } from '../../application/ports/token.port';

/**
 * `@nestjs/jwt` (via the `jsonwebtoken`/`ms` packages) types
 * `expiresIn` as a template-literal `StringValue` (e.g. `'900s'`),
 * not a general `string` — but `ConfigService.jwtAccessExpiresIn`/
 * `jwtRefreshExpiresIn` come from parsed env vars and are only known
 * to be *some* string at compile time. This single cast is the
 * boundary between the env-driven config and the library's stricter
 * type; the actual values (`'900s'`, `'7d'`) are already
 * library-valid formats.
 */
function asExpiresIn(value: string): JwtSignOptions['expiresIn'] {
  return value as JwtSignOptions['expiresIn'];
}

/**
 * `TokenService` implementation backed by `@nestjs/jwt`. Access and
 * refresh tokens use separate secrets (`JWT_ACCESS_SECRET`/
 * `JWT_REFRESH_SECRET`) so a leaked access-token secret alone can't
 * be used to mint refresh tokens, or vice versa. The only place in
 * this module that imports `@nestjs/jwt`.
 */
@Injectable()
export class JwtTokenService implements TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  signAccessToken(claims: TokenClaims): string {
    return this.jwtService.sign(
      { ...claims, jti: randomUUID() },
      {
        secret: this.config.jwtAccessSecret,
        expiresIn: asExpiresIn(this.config.jwtAccessExpiresIn),
        issuer: this.config.jwtIssuer,
        audience: this.config.jwtAudience,
      },
    );
  }

  signRefreshToken(claims: TokenClaims): string {
    // `jti` (a random per-issuance id) guarantees two tokens signed
    // with identical claims in the same second are never
    // byte-identical — required for refresh-token rotation, where
    // each issuance must hash to a distinct, individually revocable
    // `RefreshToken` row.
    return this.jwtService.sign(
      { ...claims, jti: randomUUID() },
      {
        secret: this.config.jwtRefreshSecret,
        expiresIn: asExpiresIn(this.config.jwtRefreshExpiresIn),
        issuer: this.config.jwtIssuer,
        audience: this.config.jwtAudience,
      },
    );
  }

  verifyAccessToken(token: string): TokenClaims {
    return this.verify(token, this.config.jwtAccessSecret);
  }

  verifyRefreshToken(token: string): TokenClaims {
    return this.verify(token, this.config.jwtRefreshSecret);
  }

  hashRefreshToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }

  getExpiry(token: string): Date {
    const decoded = this.jwtService.decode<{ exp?: number }>(token);
    if (!decoded?.exp) {
      throw new UnauthorizedException('Malformed token');
    }
    return new Date(decoded.exp * 1000);
  }

  private verify(token: string, secret: string): TokenClaims {
    try {
      return this.jwtService.verify<TokenClaims>(token, {
        secret,
        issuer: this.config.jwtIssuer,
        audience: this.config.jwtAudience,
      });
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
