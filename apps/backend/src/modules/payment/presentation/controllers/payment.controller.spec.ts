import { PaymentController } from './payment.controller';
import { CreatePaymentUseCase } from '../../application/use_cases/create-payment.use-case';
import { UpdatePaymentUseCase } from '../../application/use_cases/update-payment.use-case';
import { CancelPaymentUseCase } from '../../application/use_cases/cancel-payment.use-case';
import { GetPaymentUseCase } from '../../application/use_cases/get-payment.use-case';
import { ListPaymentUseCase } from '../../application/use_cases/list-payment.use-case';
import { SearchPaymentUseCase } from '../../application/use_cases/search-payment.use-case';
import { CreatePaymentCommand } from '../../application/commands/create-payment.command';
import { UpdatePaymentCommand } from '../../application/commands/update-payment.command';
import { CancelPaymentCommand } from '../../application/commands/cancel-payment.command';
import { GetPaymentQuery } from '../../application/queries/get-payment.query';
import { ListPaymentQuery } from '../../application/queries/list-payment.query';
import { SearchPaymentQuery } from '../../application/queries/search-payment.query';
import { PaymentDto } from '../../application/dto/payment.dto';
import { PaymentMethod } from '../../domain/value-objects/payment-method.value-object';
import { PaymentStatus } from '../../domain/value-objects/payment-status.value-object';
import { CreatePaymentRequestDto } from '../dto/create-payment.request.dto';
import { UpdatePaymentRequestDto } from '../dto/update-payment.request.dto';
import { NotFoundException } from '../../../core/domain/exceptions/not-found.exception';
import { Caller } from '../../../core/application/caller';
import type { AuthenticatedUser } from '../../../../common/auth/authenticated-user.interface';
import { Role } from '../../../../common/auth/role.enum';

describe('PaymentController', () => {
  const user: AuthenticatedUser = { id: 'identity-1', role: Role.Customer };
  const caller: Caller = { identityId: 'identity-1', isAdmin: false };
  let controller: PaymentController;
  let createUseCase: { execute: jest.Mock };
  let updateUseCase: { execute: jest.Mock };
  let cancelUseCase: { execute: jest.Mock };
  let getUseCase: { execute: jest.Mock };
  let listUseCase: { execute: jest.Mock };
  let searchUseCase: { execute: jest.Mock };

  const paymentDto: PaymentDto = {
    id: 'id-1',
    quoteId: 'quote-1',
    orderId: 'order-1',
    payerIdentityId: 'identity-1',
    receiverProviderId: 'provider-1',
    amount: 75.0,
    method: PaymentMethod.Card,
    status: PaymentStatus.Pending,
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
    updatedAt: new Date('2026-01-01T00:00:00.000Z'),
  };

  beforeEach(() => {
    createUseCase = { execute: jest.fn().mockResolvedValue(paymentDto) };
    updateUseCase = { execute: jest.fn().mockResolvedValue(paymentDto) };
    cancelUseCase = { execute: jest.fn().mockResolvedValue(paymentDto) };
    getUseCase = { execute: jest.fn().mockResolvedValue(paymentDto) };
    listUseCase = {
      execute: jest.fn().mockResolvedValue({
        items: [paymentDto],
        total: 1,
        page: 1,
        pageSize: 20,
      }),
    };
    searchUseCase = { execute: jest.fn().mockResolvedValue([paymentDto]) };

    controller = new PaymentController(
      createUseCase as unknown as CreatePaymentUseCase,
      updateUseCase as unknown as UpdatePaymentUseCase,
      cancelUseCase as unknown as CancelPaymentUseCase,
      getUseCase as unknown as GetPaymentUseCase,
      listUseCase as unknown as ListPaymentUseCase,
      searchUseCase as unknown as SearchPaymentUseCase,
    );
  });

  it('create() maps the request DTO to a command and the Application DTO to a response DTO', async () => {
    const dto: CreatePaymentRequestDto = {
      quoteId: 'quote-1',
      orderId: 'order-1',
      payerIdentityId: 'identity-1',
      receiverProviderId: 'provider-1',
      amount: 75.0,
      method: PaymentMethod.Card,
    };

    const response = await controller.create(dto, user);

    expect(createUseCase.execute).toHaveBeenCalledWith(
      new CreatePaymentCommand(
        'quote-1',
        'order-1',
        'identity-1',
        'provider-1',
        75.0,
        PaymentMethod.Card,
        caller,
      ),
    );
    expect(response.id).toBe('id-1');
  });

  it('update() maps id + request DTO + caller to a command', async () => {
    const dto: UpdatePaymentRequestDto = { status: PaymentStatus.Completed };

    const response = await controller.update('id-1', dto, user);

    expect(updateUseCase.execute).toHaveBeenCalledWith(
      new UpdatePaymentCommand('id-1', caller, PaymentStatus.Completed),
    );
    expect(response.id).toBe('id-1');
  });

  it('cancel() delegates to CancelPaymentUseCase with the id and the caller', async () => {
    const response = await controller.cancel('id-1', user);

    expect(cancelUseCase.execute).toHaveBeenCalledWith(
      new CancelPaymentCommand('id-1', caller),
    );
    expect(response.id).toBe('id-1');
  });

  it('list() maps page/pageSize query params plus the caller to a query', async () => {
    const response = await controller.list(user, '2', '10');

    expect(listUseCase.execute).toHaveBeenCalledWith(
      new ListPaymentQuery(caller, 2, 10),
    );
    expect(response.items).toHaveLength(1);
    expect(response.total).toBe(1);
  });

  it('search() maps the term query param and the caller', async () => {
    const response = await controller.search('CARD', user);

    expect(searchUseCase.execute).toHaveBeenCalledWith(
      new SearchPaymentQuery('CARD', caller),
    );
    expect(response).toHaveLength(1);
    expect(response[0].method).toBe(PaymentMethod.Card);
  });

  it('findOne() maps the Application DTO returned by GetPaymentUseCase', async () => {
    const response = await controller.findOne('id-1', user);

    expect(getUseCase.execute).toHaveBeenCalledWith(
      new GetPaymentQuery('id-1', caller),
    );
    expect(response.id).toBe('id-1');
  });

  it('findOne() throws NotFoundException when GetPaymentUseCase returns null', async () => {
    getUseCase.execute.mockResolvedValue(null);

    await expect(controller.findOne('unknown-id', user)).rejects.toThrow(
      NotFoundException,
    );
  });
});
