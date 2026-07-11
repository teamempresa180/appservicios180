import { validateEnv } from './env.validation';

describe('validateEnv', () => {
  it('parses valid environment variables', () => {
    const result = validateEnv({ NODE_ENV: 'production', PORT: '4000' });
    expect(result).toEqual({ NODE_ENV: 'production', PORT: 4000 });
  });

  it('defaults NODE_ENV to development and PORT to 3000 when absent', () => {
    const result = validateEnv({});
    expect(result).toEqual({ NODE_ENV: 'development', PORT: 3000 });
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
});
