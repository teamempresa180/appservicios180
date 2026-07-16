import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '../../src/config/config.service';

/**
 * Signs an access token for e2e tests, using the SAME secret/issuer/
 * audience the app-under-test's own `JwtStrategy` was constructed
 * with (`app.get(ConfigService)` — resolved from the test's own
 * `TestingModule`, not a freshly-constructed `ConfigService`, since a
 * fresh instance would generate its own random ephemeral secret and
 * never verify). Each e2e spec that needs an authenticated request
 * must import `ConfigModule` + `PassportModule.register({
 * defaultStrategy: 'jwt' })` + provide `JwtStrategy`, mirroring
 * `AuthenticationPresentationModule` (Prompt 78, Security Hardening).
 */
export function signTestAccessToken(
  config: ConfigService,
  claims: { sub: string; role: string } = {
    sub: 'test-identity',
    role: 'CUSTOMER',
  },
): string {
  return new JwtService().sign(
    { ...claims, jti: 'test-jti' },
    {
      secret: config.jwtAccessSecret,
      expiresIn: '900s',
      issuer: config.jwtIssuer,
      audience: config.jwtAudience,
    },
  );
}
