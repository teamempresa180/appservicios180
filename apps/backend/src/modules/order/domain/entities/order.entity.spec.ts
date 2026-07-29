import { Order } from './order.entity';
import { OrderId } from '../value-objects/order-id.value-object';
import { OrderStatus } from '../value-objects/order-status.value-object';
import { OrderPriority } from '../value-objects/order-priority.value-object';
import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';
import { ProviderId } from '../../../provider/domain/value-objects/provider-id.value-object';
import { ServiceId } from '../../../service/domain/value-objects/service-id.value-object';
import { CategoryId } from '../../../category/domain/value-objects/category-id.value-object';

describe('Order', () => {
  it('holds all the assigned properties', () => {
    const id = OrderId.create();
    const identityId = IdentityId.create();
    const providerId = ProviderId.create();
    const serviceId = ServiceId.create();
    const categoryId = CategoryId.create();
    const now = new Date();
    const order = new Order(id, {
      identityId,
      providerId,
      serviceId,
      categoryId,
      title: 'Destape urgente',
      description: 'Tubería obstruida en la cocina',
      scheduledDate: new Date('2026-02-01'),
      status: OrderStatus.Pending,
      priority: OrderPriority.Urgent,
      createdAt: now,
      updatedAt: now,
    });

    expect(order.id).toBe(id);
    expect(order.identityId).toBe(identityId);
    expect(order.providerId).toBe(providerId);
    expect(order.serviceId).toBe(serviceId);
    expect(order.title).toBe('Destape urgente');
    expect(order.status).toBe(OrderStatus.Pending);
    expect(order.priority).toBe(OrderPriority.Urgent);
  });

  it('is equal to another order with the same id', () => {
    const id = OrderId.create();
    const identityId = IdentityId.create();
    const providerId = ProviderId.create();
    const serviceId = ServiceId.create();
    const categoryId = CategoryId.create();
    const now = new Date();
    const props = {
      identityId,
      providerId,
      serviceId,
      categoryId,
      title: 'Servicio',
      description: 'Desc',
      scheduledDate: now,
      status: OrderStatus.Pending,
      priority: OrderPriority.Medium,
      createdAt: now,
      updatedAt: now,
    };
    const a = new Order(id, props);
    const b = new Order(id, props);
    expect(a.equals(b)).toBe(true);
  });
});
