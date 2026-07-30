import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AppLogger } from '../logger/app-logger.service';
import { buildErrorResponse } from './error-response';

/**
 * Last-resort filter for anything `DomainExceptionFilter` doesn't
 * catch — Nest's own `HttpException`s (e.g. a malformed route) and
 * genuinely unexpected errors. Registered globally in `main.ts`
 * *before* `DomainExceptionFilter` so Nest tries the more specific
 * filter first (Nest matches `@Catch` filters most-specific-first
 * regardless of registration order, but keeping this one last in the
 * `main.ts` list documents the intent).
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new AppLogger();

  constructor() {
    this.logger.setContext(AllExceptionsFilter.name);
  }

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    if (exception instanceof HttpException) {
      const statusCode = exception.getStatus();
      const body = buildErrorResponse(
        statusCode,
        exception.name,
        exception.message,
        request.url,
      );
      this.logger.warn(`${exception.name}: ${exception.message}`);
      response.status(statusCode).json(body);
      return;
    }

    // Never forward the raw error message to the client for an
    // unexpected failure — it may be a driver-level error (e.g. a
    // Prisma error exposing column/table names or query fragments) or
    // any other internal detail. The real message/stack is logged
    // server-side only; the client always gets the same generic text.
    const internalMessage =
      exception instanceof Error ? exception.message : String(exception);
    const body = buildErrorResponse(
      HttpStatus.INTERNAL_SERVER_ERROR,
      'InternalServerError',
      'Internal server error',
      request.url,
    );
    this.logger.error(
      internalMessage,
      exception instanceof Error ? exception.stack : undefined,
    );
    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(body);
  }
}
