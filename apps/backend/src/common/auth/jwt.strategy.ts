import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '../../config/config.service';
import { TokenClaims } from '../../modules/authentication/application/ports/token.port';
import { AuthenticatedUser } from './authenticated-user.interface';

/**
 * Validates the `Bearer` access token on every request guarded by
 * `JwtAuthGuard`. Registered once (in `AuthenticationPresentationModule`)
 * but usable from any module's `@UseGuards(JwtAuthGuard)` — Passport
 * strategies register into a process-global registry by name (`'jwt'`),
 * they aren't scoped to the Nest module that declares them.
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.jwtAccessSecret,
      issuer: config.jwtIssuer,
      audience: config.jwtAudience,
    });
  }

  validate(payload: TokenClaims): AuthenticatedUser {
    return { id: payload.sub, role: payload.role };
  }
}
