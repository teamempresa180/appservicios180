import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { BusinessRuleException } from '../../modules/core/domain/exceptions/business-rule.exception';
import { DomainException } from '../../modules/core/domain/exceptions/domain.exception';
import { ForbiddenException } from '../../modules/core/domain/exceptions/forbidden.exception';
import { NotFoundException } from '../../modules/core/domain/exceptions/not-found.exception';
import { UnauthorizedException } from '../../modules/core/domain/exceptions/unauthorized.exception';
import { ValidationException } from '../../modules/core/domain/exceptions/validation.exception';
import { AppLogger } from '../logger/app-logger.service';
import { buildErrorResponse } from './error-response';

/**
 * Maps the domain exception hierarchy (`core/domain/exceptions/`) to
 * HTTP responses — the single place that decides "a `NotFoundException`
 * means 404", so no controller has to translate domain errors to HTTP
 * status codes itself once real use cases exist. Registered globally
 * in `main.ts`.
 */
@Catch(DomainException)
export class DomainExceptionFilter implements ExceptionFilter {
  private readonly logger = new AppLogger();

  constructor() {
    this.logger.setContext(DomainExceptionFilter.name);
  }

  catch(exception: DomainException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const statusCode = this.statusFor(exception);
    const body = buildErrorResponse(
      statusCode,
      exception.name,
      exception.message,
      request.url,
    );

    this.logger.warn(`${exception.name}: ${exception.message}`);
    response.status(statusCode).json(body);
  }

  private statusFor(exception: DomainException): number {
    if (exception instanceof NotFoundException) {
      return HttpStatus.NOT_FOUND;
    }
    if (exception instanceof ValidationException) {
      return HttpStatus.BAD_REQUEST;
    }
    if (exception instanceof BusinessRuleException) {
      return HttpStatus.UNPROCESSABLE_ENTITY;
    }
    if (exception instanceof UnauthorizedException) {
      return HttpStatus.UNAUTHORIZED;
    }
    if (exception instanceof ForbiddenException) {
      return HttpStatus.FORBIDDEN;
    }
    return HttpStatus.BAD_REQUEST;
  }
}
