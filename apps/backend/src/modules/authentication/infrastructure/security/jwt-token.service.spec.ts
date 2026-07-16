import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '../../../../config/config.service';
import { UnauthorizedException } from '../../../core/domain/exceptions/unauthorized.exception';
import { Role } from '../../../../common/auth/role.enum';
import { JwtTokenService } from './jwt-token.service';

function buildConfigService(
  overrides: Record<string, string> = {},
): ConfigService {
  const originalEnv = process.env;
  process.env = {
    ...originalEnv,
    NODE_ENV: 'test',
    JWT_ACCESS_SECRET: 'access-secret',
    JWT_ACCESS_EXPIRES_IN: '900s',
    JWT_REFRESH_SECRET: 'refresh-secret',
    JWT_REFRESH_EXPIRES_IN: '7d',
    JWT_ISSUER: 'test-issuer',
    JWT_AUDIENCE: 'test-audience',
    ...overrides,
  };
  const config = new ConfigService();
  process.env = originalEnv;
  return config;
}

describe('JwtTokenService', () => {
  const config = buildConfigService();
  const service = new JwtTokenService(new JwtService(), config);
  const claims = { sub: 'identity-1', role: Role.Customer };

  it('signs and verifies an access token', () => {
    const token = service.signAccessToken(claims);
    const decoded = service.verifyAccessToken(token);
    expect(decoded.sub).toBe('identity-1');
    expect(decoded.role).toBe(Role.Customer);
  });

  it('signs and verifies a refresh token', () => {
    const token = service.signRefreshToken(claims);
    const decoded = service.verifyRefreshToken(token);
    expect(decoded.sub).toBe('identity-1');
  });

  it('signs two access tokens for the same claims as distinct strings', () => {
    const first = service.signAccessToken(claims);
    const second = service.signAccessToken(claims);
    expect(first).not.toBe(second);
  });

  it('rejects an access token when verified as a refresh token (different secret)', () => {
    const token = service.signAccessToken(claims);
    expect(() => service.verifyRefreshToken(token)).toThrow(
      UnauthorizedException,
    );
  });

  it('rejects a malformed token', () => {
    expect(() => service.verifyAccessToken('not-a-real-token')).toThrow(
      UnauthorizedException,
    );
  });

  it('hashRefreshToken() is deterministic for the same input', () => {
    const token = service.signRefreshToken(claims);
    expect(service.hashRefreshToken(token)).toBe(
      service.hashRefreshToken(token),
    );
  });

  it('hashRefreshToken() differs for different tokens', () => {
    const first = service.signRefreshToken(claims);
    const second = service.signRefreshToken(claims);
    expect(service.hashRefreshToken(first)).not.toBe(
      service.hashRefreshToken(second),
    );
  });

  it('getExpiry() reads the exp claim as a future Date', () => {
    const token = service.signAccessToken(claims);
    const expiry = service.getExpiry(token);
    expect(expiry.getTime()).toBeGreaterThan(Date.now());
  });
});
