import { OrderModel as PrismaOrder } from '@prisma/client';
import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';
import { ProviderId } from '../../../provider/domain/value-objects/provider-id.value-object';
import { ServiceId } from '../../../service/domain/value-objects/service-id.value-object';
import { Order } from '../../domain/entities/order.entity';
import { OrderId } from '../../domain/value-objects/order-id.value-object';
import { OrderPriority } from '../../domain/value-objects/order-priority.value-object';
import { OrderStatus } from '../../domain/value-objects/order-status.value-object';
import { OrderPrismaMapper } from './order-prisma.mapper';

describe('OrderPrismaMapper', () => {
  const row: PrismaOrder = {
    id: 'id-1',
    identityId: 'identity-1',
    providerId: 'provider-1',
    serviceId: 'service-1',
    title: 'Fix the sink',
    description: 'The kitchen sink is leaking',
    scheduledDate: new Date('2026-01-01T08:00:00Z'),
    status: 'PENDING',
    priority: 'MEDIUM',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-02'),
  };

  it('maps a Prisma row to the domain entity', () => {
    const order = OrderPrismaMapper.toDomain(row);

    expect(order.id.value).toBe('id-1');
    expect(order.identityId.value).toBe('identity-1');
    expect(order.providerId.value).toBe('provider-1');
    expect(order.serviceId.value).toBe('service-1');
    expect(order.status).toBe(OrderStatus.Pending);
    expect(order.priority).toBe(OrderPriority.Medium);
  });

  it('maps a domain entity back to the Prisma row shape', () => {
    const order = new Order(OrderId.fromString('id-1'), {
      identityId: IdentityId.fromString('identity-1'),
      providerId: ProviderId.fromString('provider-1'),
      serviceId: ServiceId.fromString('service-1'),
      title: 'Fix the sink',
      description: 'The kitchen sink is leaking',
      scheduledDate: new Date('2026-01-01T08:00:00Z'),
      status: OrderStatus.Pending,
      priority: OrderPriority.Medium,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-02'),
    });

    expect(OrderPrismaMapper.toPersistence(order)).toEqual(row);
  });

  it('round-trips without losing data', () => {
    const order = OrderPrismaMapper.toDomain(row);
    expect(OrderPrismaMapper.toPersistence(order)).toEqual(row);
  });
});
