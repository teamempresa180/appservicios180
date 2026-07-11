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

    const message =
      exception instanceof Error ? exception.message : 'Internal server error';
    const body = buildErrorResponse(
      HttpStatus.INTERNAL_SERVER_ERROR,
      'InternalServerError',
      message,
      request.url,
    );
    this.logger.error(
      message,
      exception instanceof Error ? exception.stack : undefined,
    );
    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(body);
  }
}
