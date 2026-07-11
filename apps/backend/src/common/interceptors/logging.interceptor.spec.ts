import { CallHandler, ExecutionContext } from '@nestjs/common';
import { of } from 'rxjs';
import { AppLogger } from '../logger/app-logger.service';
import { LoggingInterceptor } from './logging.interceptor';

function createContext(): ExecutionContext {
  return {
    switchToHttp: () => ({
      getRequest: () => ({ method: 'GET', url: '/identities' }),
    }),
  } as unknown as ExecutionContext;
}

describe('LoggingInterceptor', () => {
  it('logs the request method, url and duration after the handler completes', (done) => {
    const logSpy = jest.spyOn(AppLogger.prototype, 'log').mockImplementation();
    const interceptor = new LoggingInterceptor();
    const handler: CallHandler = { handle: () => of('response') };

    interceptor.intercept(createContext(), handler).subscribe({
      complete: () => {
        expect(logSpy).toHaveBeenCalledWith(
          expect.stringMatching(/^GET \/identities — \d+ms$/),
        );
        logSpy.mockRestore();
        done();
      },
    });
  });
});
