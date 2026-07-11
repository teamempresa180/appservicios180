import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable, tap } from 'rxjs';
import { AppLogger } from '../logger/app-logger.service';

/**
 * Logs every incoming HTTP request's method/path and how long it took
 * to respond. Registered globally in `main.ts` so it applies to every
 * controller automatically, including the ones Sprint 3 adds later —
 * no per-controller wiring needed.
 */
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new AppLogger();

  constructor() {
    this.logger.setContext(LoggingInterceptor.name);
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<Request>();
    const { method, url } = request;
    const start = Date.now();

    return next.handle().pipe(
      tap(() => {
        this.logger.log(`${method} ${url} — ${Date.now() - start}ms`);
      }),
    );
  }
}
