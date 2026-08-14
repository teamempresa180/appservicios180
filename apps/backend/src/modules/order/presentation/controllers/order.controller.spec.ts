import { OrderController } from './order.controller';
import { CreateOrderUseCase } from '../../application/use_cases/create-order.use-case';
import { UpdateOrderUseCase } from '../../application/use_cases/update-order.use-case';
import { CancelOrderUseCase } from '../../application/use_cases/cancel-order.use-case';
import { StartOrderUseCase } from '../../application/use_cases/start-order.use-case';
import { CompleteOrderUseCase } from '../../application/use_cases/complete-order.use-case';
import { GetOrderUseCase } from '../../application/use_cases/get-order.use-case';
import { ListOrderUseCase } from '../../application/use_cases/list-order.use-case';
import { SearchOrderUseCase } from '../../application/use_cases/search-order.use-case';
import { CreateOrderCommand } from '../../application/commands/create-order.command';
import { UpdateOrderCommand } from '../../application/commands/update-order.command';
import { CancelOrderCommand } from '../../application/commands/cancel-order.command';
import { StartOrderCommand } from '../../application/commands/start-order.command';
import { CompleteOrderCommand } from '../../application/commands/complete-order.command';
import { GetOrderQuery } from '../../application/queries/get-order.query';
import { ListOrderQuery } from '../../application/queries/list-order.query';
import { SearchOrderQuery } from '../../application/queries/search-order.query';
import { ListMyOrdersUseCase } from '../../application/use_cases/list-my-orders.use-case';
import { ListOrdersForProviderUseCase } from '../../application/use_cases/list-orders-for-provider.use-case';
import { OrderDto } from '../../application/dto/order.dto';
import { OrderStatus } from '../../domain/value-objects/order-status.value-object';
import { OrderPriority } from '../../domain/value-objects/order-priority.value-object';
import { CreateOrderRequestDto } from '../dto/create-order.request.dto';
import { UpdateOrderRequestDto } from '../dto/update-order.request.dto';
import { NotFoundException } from '../../../core/domain/exceptions/not-found.exception';
import { Caller } from '../../../core/application/caller';
import type { AuthenticatedUser } from '../../../../common/auth/authenticated-user.interface';
import { Role } from '../../../../common/auth/role.enum';

describe('OrderController', () => {
  /** The authenticated caller every non-Admin test acts as. */
  const user: AuthenticatedUser = { id: 'identity-1', role: Role.Customer };
  const caller: Caller = { identityId: 'identity-1', isAdmin: false };
  let controller: OrderController;
  let createUseCase: { execute: jest.Mock };
  let updateUseCase: { execute: jest.Mock };
  let cancelUseCase: { execute: jest.Mock };
  let startUseCase: { execute: jest.Mock };
  let completeUseCase: { execute: jest.Mock };
  let getUseCase: { execute: jest.Mock };
  let listUseCase: { execute: jest.Mock };
  let searchUseCase: { execute: jest.Mock };
  let myOrdersUseCase: { execute: jest.Mock };
  let providerOrdersUseCase: { execute: jest.Mock };

  const orderDto: OrderDto = {
    id: 'id-1',
    identityId: 'identity-1',
    providerId: 'provider-1',
    serviceId: 'service-1',
    categoryId: 'category-1',
    addressId: null,
    title: 'Fix leaking kitchen faucet',
    description:
      'The faucet under the kitchen sink has been leaking for a week.',
    scheduledDate: new Date('2026-02-01T09:00:00.000Z'),
    status: OrderStatus.Pending,
    priority: OrderPriority.Medium,
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
    updatedAt: new Date('2026-01-01T00:00:00.000Z'),
  };

  beforeEach(() => {
    createUseCase = { execute: jest.fn().mockResolvedValue(orderDto) };
    updateUseCase = { execute: jest.fn().mockResolvedValue(orderDto) };
    cancelUseCase = { execute: jest.fn().mockResolvedValue(orderDto) };
    startUseCase = { execute: jest.fn().mockResolvedValue(orderDto) };
    completeUseCase = { execute: jest.fn().mockResolvedValue(orderDto) };
    getUseCase = { execute: jest.fn().mockResolvedValue(orderDto) };
    listUseCase = {
      execute: jest.fn().mockResolvedValue({
        items: [orderDto],
        total: 1,
        page: 1,
        pageSize: 20,
      }),
    };
    searchUseCase = { execute: jest.fn().mockResolvedValue([orderDto]) };
    myOrdersUseCase = { execute: jest.fn().mockResolvedValue([orderDto]) };
    providerOrdersUseCase = { execute: jest.fn().mockResolvedValue([orderDto]) };

    controller = new OrderController(
      createUseCase as unknown as CreateOrderUseCase,
      updateUseCase as unknown as UpdateOrderUseCase,
      cancelUseCase as unknown as CancelOrderUseCase,
      startUseCase as unknown as StartOrderUseCase,
      completeUseCase as unknown as CompleteOrderUseCase,
      getUseCase as unknown as GetOrderUseCase,
      listUseCase as unknown as ListOrderUseCase,
      searchUseCase as unknown as SearchOrderUseCase,
      myOrdersUseCase as unknown as ListMyOrdersUseCase,
      providerOrdersUseCase as unknown as ListOrdersForProviderUseCase,
    );
  });

  it('create() maps the request DTO to a command and the Application DTO to a response DTO', async () => {
    const dto: CreateOrderRequestDto = {
      identityId: 'identity-1',
      categoryId: 'category-1',
      providerId: 'provider-1',
      serviceId: 'service-1',
      title: 'Fix leaking kitchen faucet',
      description:
        'The faucet under the kitchen sink has been leaking for a week.',
      scheduledDate: '2026-02-01T09:00:00.000Z',
      priority: OrderPriority.Medium,
    };

    const response = await controller.create(dto);

    expect(createUseCase.execute).toHaveBeenCalledWith(
      new CreateOrderCommand(
        'identity-1',
        'category-1',
        'Fix leaking kitchen faucet',
        'The faucet under the kitchen sink has been leaking for a week.',
        new Date('2026-02-01T09:00:00.000Z'),
        OrderPriority.Medium,
        'provider-1',
        'service-1',
      ),
    );
    expect(response.id).toBe('id-1');
  });

  it('mine() delegates to ListMyOrdersUseCase with the caller id', async () => {
    const response = await controller.mine(user);

    expect(myOrdersUseCase.execute).toHaveBeenCalledWith('identity-1');
    expect(response).toHaveLength(1);
  });

  it('relevantForProvider() delegates to ListOrdersForProviderUseCase with the caller id', async () => {
    const response = await controller.relevantForProvider({
      id: 'identity-1',
      role: Role.Provider,
    });

    expect(providerOrdersUseCase.execute).toHaveBeenCalledWith('identity-1');
    expect(response).toHaveLength(1);
  });

  it('update() maps id + request DTO + caller to a command', async () => {
    const dto: UpdateOrderRequestDto = { title: 'New Title' };

    const response = await controller.update('id-1', dto, user);

    expect(updateUseCase.execute).toHaveBeenCalledWith(
      new UpdateOrderCommand(
        'id-1',
        caller,
        'New Title',
        undefined,
        undefined,
        undefined,
      ),
    );
    expect(response.id).toBe('id-1');
  });

  it('cancel() delegates to CancelOrderUseCase with the id and the caller', async () => {
    const response = await controller.cancel('id-1', user);

    expect(cancelUseCase.execute).toHaveBeenCalledWith(
      new CancelOrderCommand('id-1', caller),
    );
    expect(response.id).toBe('id-1');
  });

  it('start() delegates to StartOrderUseCase with the id and the caller', async () => {
    const response = await controller.start('id-1', user);

    expect(startUseCase.execute).toHaveBeenCalledWith(
      new StartOrderCommand('id-1', caller),
    );
    expect(response.id).toBe('id-1');
  });

  it('complete() delegates to CompleteOrderUseCase with the id and the caller', async () => {
    const response = await controller.complete('id-1', user);

    expect(completeUseCase.execute).toHaveBeenCalledWith(
      new CompleteOrderCommand('id-1', caller),
    );
    expect(response.id).toBe('id-1');
  });

  it('marks the caller as an Admin when the JWT carries the Admin role', async () => {
    await controller.cancel('id-1', { id: 'admin-1', role: Role.Admin });

    expect(cancelUseCase.execute).toHaveBeenCalledWith(
      new CancelOrderCommand('id-1', {
        identityId: 'admin-1',
        isAdmin: true,
      }),
    );
  });

  it('list() maps page/pageSize query params to a query and wraps the paginated result', async () => {
    const response = await controller.list('2', '10');

    expect(listUseCase.execute).toHaveBeenCalledWith(new ListOrderQuery(2, 10));
    expect(response.items).toHaveLength(1);
    expect(response.total).toBe(1);
  });

  it('search() maps the term query param and the Application DTOs to response DTOs', async () => {
    const response = await controller.search('faucet');

    expect(searchUseCase.execute).toHaveBeenCalledWith(
      new SearchOrderQuery('faucet'),
    );
    expect(response).toHaveLength(1);
    expect(response[0].title).toBe('Fix leaking kitchen faucet');
  });

  it('findOne() maps the Application DTO returned by GetOrderUseCase', async () => {
    const response = await controller.findOne('id-1', user);

    expect(getUseCase.execute).toHaveBeenCalledWith(
      new GetOrderQuery('id-1', caller),
    );
    expect(response.title).toBe('Fix leaking kitchen faucet');
  });

  it('findOne() throws NotFoundException when GetOrderUseCase returns null', async () => {
    getUseCase.execute.mockResolvedValue(null);

    await expect(controller.findOne('unknown-id', user)).rejects.toThrow(
      NotFoundException,
    );
  });
});
