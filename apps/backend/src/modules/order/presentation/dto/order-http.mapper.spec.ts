import { OrderDto } from '../../application/dto/order.dto';
import { OrderStatus } from '../../domain/value-objects/order-status.value-object';
import { OrderPriority } from '../../domain/value-objects/order-priority.value-object';
import { CreateOrderRequestDto } from './create-order.request.dto';
import { UpdateOrderRequestDto } from './update-order.request.dto';
import { OrderHttpMapper } from './order-http.mapper';

describe('OrderHttpMapper', () => {
  it('toCreateCommand() parses the ISO date string to Date', () => {
    const dto: CreateOrderRequestDto = {
      identityId: 'identity-1',
      categoryId: 'category-1',
      providerId: 'provider-1',
      serviceId: 'service-1',
      title: 'Fix leaking kitchen faucet',
      description: 'Description.',
      scheduledDate: '2026-02-01T09:00:00.000Z',
      priority: OrderPriority.Urgent,
    };

    const command = OrderHttpMapper.toCreateCommand(dto);

    expect(command.identityId).toBe('identity-1');
    expect(command.scheduledDate).toEqual(new Date('2026-02-01T09:00:00.000Z'));
    expect(command.priority).toBe(OrderPriority.Urgent);
  });

  it('toUpdateCommand() carries the id and optional fields through, parsing the date', () => {
    const dto: UpdateOrderRequestDto = {
      scheduledDate: '2026-02-02T09:00:00.000Z',
      priority: OrderPriority.Low,
    };

    const command = OrderHttpMapper.toUpdateCommand('id-1', dto);

    expect(command.id).toBe('id-1');
    expect(command.scheduledDate).toEqual(new Date('2026-02-02T09:00:00.000Z'));
    expect(command.priority).toBe(OrderPriority.Low);
  });

  it('toResponse() converts Date fields to ISO strings', () => {
    const dto: OrderDto = {
      id: 'id-1',
      identityId: 'identity-1',
      providerId: 'provider-1',
      serviceId: 'service-1',
      categoryId: 'category-1',
      addressId: null,
      title: 'Fix leaking kitchen faucet',
      description: 'Description.',
      scheduledDate: new Date('2026-02-01T09:00:00.000Z'),
      status: OrderStatus.Pending,
      priority: OrderPriority.Medium,
      createdAt: new Date('2026-01-01T00:00:00.000Z'),
      updatedAt: new Date('2026-01-02T00:00:00.000Z'),
    };

    const response = OrderHttpMapper.toResponse(dto);

    expect(response.scheduledDate).toBe('2026-02-01T09:00:00.000Z');
    expect(response.createdAt).toBe('2026-01-01T00:00:00.000Z');
    expect(response.updatedAt).toBe('2026-01-02T00:00:00.000Z');
  });

  it('toListResponse() maps each item and carries pagination metadata through', () => {
    const dto: OrderDto = {
      id: 'id-1',
      identityId: 'identity-1',
      providerId: 'provider-1',
      serviceId: 'service-1',
      categoryId: 'category-1',
      addressId: null,
      title: 'Fix leaking kitchen faucet',
      description: 'Description.',
      scheduledDate: new Date('2026-02-01T09:00:00.000Z'),
      status: OrderStatus.Pending,
      priority: OrderPriority.Medium,
      createdAt: new Date('2026-01-01T00:00:00.000Z'),
      updatedAt: new Date('2026-01-01T00:00:00.000Z'),
    };

    const response = OrderHttpMapper.toListResponse({
      items: [dto],
      total: 1,
      page: 1,
      pageSize: 20,
    });

    expect(response.items).toHaveLength(1);
    expect(response.items[0].id).toBe('id-1');
    expect(response.total).toBe(1);
  });
});
