import { ConfigService } from './config.service';

describe('ConfigService', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('exposes the parsed port and node environment', () => {
    process.env.NODE_ENV = 'test';
    process.env.PORT = '5050';

    const config = new ConfigService();

    expect(config.port).toBe(5050);
    expect(config.nodeEnv).toBe('test');
    expect(config.isProduction).toBe(false);
  });

  it('reports isProduction correctly', () => {
    process.env.NODE_ENV = 'production';
    process.env.PORT = '3000';
    process.env.JWT_ACCESS_SECRET = 'access-secret';
    process.env.JWT_REFRESH_SECRET = 'refresh-secret';
    process.env.CORS_ORIGIN = 'https://app.example.com';

    const config = new ConfigService();

    expect(config.isProduction).toBe(true);
  });

  it('exposes JWT settings', () => {
    process.env.NODE_ENV = 'test';
    process.env.JWT_ACCESS_SECRET = 'access-secret';
    process.env.JWT_ACCESS_EXPIRES_IN = '10m';
    process.env.JWT_REFRESH_SECRET = 'refresh-secret';
    process.env.JWT_REFRESH_EXPIRES_IN = '30d';
    process.env.JWT_ISSUER = 'issuer';
    process.env.JWT_AUDIENCE = 'audience';

    const config = new ConfigService();

    expect(config.jwtAccessSecret).toBe('access-secret');
    expect(config.jwtAccessExpiresIn).toBe('10m');
    expect(config.jwtRefreshSecret).toBe('refresh-secret');
    expect(config.jwtRefreshExpiresIn).toBe('30d');
    expect(config.jwtIssuer).toBe('issuer');
    expect(config.jwtAudience).toBe('audience');
  });

  it('exposes corsOrigin as "*" by default', () => {
    process.env.NODE_ENV = 'test';

    const config = new ConfigService();

    expect(config.corsOrigin).toBe('*');
  });

  it('parses a comma-separated CORS_ORIGIN into a trimmed array', () => {
    process.env.NODE_ENV = 'test';
    process.env.CORS_ORIGIN =
      'https://app.example.com, https://admin.example.com';

    const config = new ConfigService();

    expect(config.corsOrigin).toEqual([
      'https://app.example.com',
      'https://admin.example.com',
    ]);
  });
});
