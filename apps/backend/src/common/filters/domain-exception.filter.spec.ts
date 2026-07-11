import { ArgumentsHost, HttpStatus } from '@nestjs/common';
import { BusinessRuleException } from '../../modules/core/domain/exceptions/business-rule.exception';
import { NotFoundException } from '../../modules/core/domain/exceptions/not-found.exception';
import { ValidationException } from '../../modules/core/domain/exceptions/validation.exception';
import { DomainExceptionFilter } from './domain-exception.filter';

function createHost(url = '/identities/123') {
  const json = jest.fn();
  const status = jest.fn().mockReturnValue({ json });
  const host = {
    switchToHttp: () => ({
      getResponse: () => ({ status }),
      getRequest: () => ({ url }),
    }),
  } as unknown as ArgumentsHost;
  return { host, status, json };
}

describe('DomainExceptionFilter', () => {
  const filter = new DomainExceptionFilter();

  it('maps NotFoundException to 404', () => {
    const { host, status, json } = createHost();
    filter.catch(new NotFoundException('Identity 123 not found'), host);

    expect(status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: HttpStatus.NOT_FOUND,
        error: 'NotFoundException',
        message: 'Identity 123 not found',
        path: '/identities/123',
      }),
    );
  });

  it('maps ValidationException to 400', () => {
    const { host, status } = createHost();
    filter.catch(new ValidationException('fullName is required'), host);
    expect(status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
  });

  it('maps BusinessRuleException to 422', () => {
    const { host, status } = createHost();
    filter.catch(
      new BusinessRuleException('Order already has an accepted Quote'),
      host,
    );
    expect(status).toHaveBeenCalledWith(HttpStatus.UNPROCESSABLE_ENTITY);
  });
});
