import { Logger } from '@nestjs/common';
import { AppLogger } from './app-logger.service';

describe('AppLogger', () => {
  it('delegates log/error/warn/debug to Nest Logger, forwarding the context', () => {
    const logSpy = jest.spyOn(Logger.prototype, 'log').mockImplementation();
    const errorSpy = jest.spyOn(Logger.prototype, 'error').mockImplementation();
    const warnSpy = jest.spyOn(Logger.prototype, 'warn').mockImplementation();
    const debugSpy = jest.spyOn(Logger.prototype, 'debug').mockImplementation();

    const logger = new AppLogger();
    logger.setContext('TestContext');
    logger.log('hello');
    logger.error('boom', 'trace');
    logger.warn('careful');
    logger.debug('details');

    expect(logSpy).toHaveBeenCalledWith('hello', 'TestContext');
    expect(errorSpy).toHaveBeenCalledWith('boom', 'trace', 'TestContext');
    expect(warnSpy).toHaveBeenCalledWith('careful', 'TestContext');
    expect(debugSpy).toHaveBeenCalledWith('details', 'TestContext');

    logSpy.mockRestore();
    errorSpy.mockRestore();
    warnSpy.mockRestore();
    debugSpy.mockRestore();
  });

  it('works without a context set', () => {
    const logSpy = jest.spyOn(Logger.prototype, 'log').mockImplementation();

    const logger = new AppLogger();
    logger.log('hello');

    expect(logSpy).toHaveBeenCalledWith('hello', undefined);

    logSpy.mockRestore();
  });
});
