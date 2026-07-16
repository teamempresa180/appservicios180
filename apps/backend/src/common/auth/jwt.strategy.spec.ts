import { ConfigService } from '../../config/config.service';
import { Role } from './role.enum';
import { JwtStrategy } from './jwt.strategy';

function buildConfigService(): ConfigService {
  const originalEnv = process.env;
  process.env = {
    ...originalEnv,
    NODE_ENV: 'test',
    JWT_ACCESS_SECRET: 'access-secret',
    JWT_REFRESH_SECRET: 'refresh-secret',
  };
  const config = new ConfigService();
  process.env = originalEnv;
  return config;
}

describe('JwtStrategy', () => {
  it('validate() maps the JWT payload to an AuthenticatedUser', () => {
    const strategy = new JwtStrategy(buildConfigService());

    const result = strategy.validate({
      sub: 'identity-1',
      role: Role.Provider,
    });

    expect(result).toEqual({ id: 'identity-1', role: Role.Provider });
  });
});
