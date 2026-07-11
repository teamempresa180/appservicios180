import { validateEnv } from './env.validation';

describe('validateEnv', () => {
  it('parses valid environment variables', () => {
    const result = validateEnv({
      NODE_ENV: 'production',
      PORT: '4000',
      DATABASE_URL: 'postgresql://user:pass@localhost:5432/db',
    });
    expect(result).toEqual({
      NODE_ENV: 'production',
      PORT: 4000,
      DATABASE_URL: 'postgresql://user:pass@localhost:5432/db',
    });
  });

  it('defaults NODE_ENV, PORT and DATABASE_URL when absent', () => {
    const result = validateEnv({});
    expect(result).toEqual({
      NODE_ENV: 'development',
      PORT: 3000,
      DATABASE_URL: 'postgresql://localhost:5432/appservicios',
    });
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
