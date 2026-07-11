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

    const config = new ConfigService();

    expect(config.isProduction).toBe(true);
  });
});
