import { validateEnv } from './env.validation';

describe('validateEnv', () => {
  it('parses valid environment variables', () => {
    const result = validateEnv({
      NODE_ENV: 'production',
      PORT: '4000',
      DATABASE_URL: 'postgresql://user:pass@localhost:5432/db',
      JWT_ACCESS_SECRET: 'access-secret',
      JWT_REFRESH_SECRET: 'refresh-secret',
    });
    expect(result).toEqual({
      NODE_ENV: 'production',
      PORT: 4000,
      DATABASE_URL: 'postgresql://user:pass@localhost:5432/db',
      JWT_ACCESS_SECRET: 'access-secret',
      JWT_ACCESS_EXPIRES_IN: '900s',
      JWT_REFRESH_SECRET: 'refresh-secret',
      JWT_REFRESH_EXPIRES_IN: '7d',
      JWT_ISSUER: 'servicios180-api',
      JWT_AUDIENCE: 'servicios180-clients',
      CORS_ORIGIN: '*',
    });
  });

  it('defaults NODE_ENV, PORT, DATABASE_URL, JWT and CORS settings when absent', () => {
    const result = validateEnv({});
    expect(result.NODE_ENV).toBe('development');
    expect(result.PORT).toBe(3000);
    expect(result.DATABASE_URL).toBe(
      'postgresql://localhost:5432/appservicios',
    );
    expect(result.JWT_ACCESS_EXPIRES_IN).toBe('900s');
    expect(result.JWT_REFRESH_EXPIRES_IN).toBe('7d');
    expect(result.JWT_ISSUER).toBe('servicios180-api');
    expect(result.JWT_AUDIENCE).toBe('servicios180-clients');
    expect(result.CORS_ORIGIN).toBe('*');
  });

  it('uses a provided CORS_ORIGIN instead of the default', () => {
    const result = validateEnv({
      CORS_ORIGIN: 'https://app.example.com,https://admin.example.com',
    });
    expect(result.CORS_ORIGIN).toBe(
      'https://app.example.com,https://admin.example.com',
    );
  });

  it('generates an ephemeral JWT_ACCESS_SECRET/JWT_REFRESH_SECRET outside production when absent', () => {
    const result = validateEnv({ NODE_ENV: 'development' });
    expect(result.JWT_ACCESS_SECRET).toEqual(expect.any(String));
    expect(result.JWT_ACCESS_SECRET.length).toBeGreaterThanOrEqual(32);
    expect(result.JWT_REFRESH_SECRET).toEqual(expect.any(String));
    expect(result.JWT_ACCESS_SECRET).not.toBe(result.JWT_REFRESH_SECRET);
  });

  it('throws when JWT_ACCESS_SECRET is missing in production', () => {
    expect(() =>
      validateEnv({ NODE_ENV: 'production', JWT_REFRESH_SECRET: 'x' }),
    ).toThrow(/JWT_ACCESS_SECRET/);
  });

  it('throws when JWT_REFRESH_SECRET is missing in production', () => {
    expect(() =>
      validateEnv({ NODE_ENV: 'production', JWT_ACCESS_SECRET: 'x' }),
    ).toThrow(/JWT_REFRESH_SECRET/);
  });

  it('throws on an invalid NODE_ENV', () => {
    expect(() => validateEnv({ NODE_ENV: 'staging' })).toThrow(/NODE_ENV/);
  });

  it('throws on a non-numeric PORT', () => {
    expect(() => validateEnv({ PORT: 'abc' })).toThrow(/PORT/);
  });

  it('throws on a non-positive PORT', () => {
    expect(() => validateEnv({ PORT: '0' })).toThrow(/PORT/);
  });

  it('uses a provided DATABASE_URL instead of the default', () => {
    const result = validateEnv({
      DATABASE_URL: 'postgresql://custom:custom@db:5432/custom',
    });
    expect(result.DATABASE_URL).toBe(
      'postgresql://custom:custom@db:5432/custom',
    );
  });
});
