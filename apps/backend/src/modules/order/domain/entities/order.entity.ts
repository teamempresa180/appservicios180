import { Entity } from '../../../core/domain/base/entity.base';
import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';
import { ProviderId } from '../../../provider/domain/value-objects/provider-id.value-object';
import { ServiceId } from '../../../service/domain/value-objects/service-id.value-object';
import { OrderId } from '../value-objects/order-id.value-object';
import { OrderStatus } from '../value-objects/order-status.value-object';
import { OrderPriority } from '../value-objects/order-priority.value-object';

export interface OrderProps {
  identityId: IdentityId;
  providerId: ProviderId;
  serviceId: ServiceId;
  title: string;
  description: string;
  scheduledDate: Date;
  status: OrderStatus;
  priority: OrderPriority;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Represents a customer's request for a service from a provider.
 * Pure data holder — no payments, no chat, no scheduling logic, no
 * tracking, no reviews, no notifications, no persistence, no business rules.
 */
export class Order extends Entity<OrderId> {
  public readonly identityId: IdentityId;
  public readonly providerId: ProviderId;
  public readonly serviceId: ServiceId;
  public readonly title: string;
  public readonly description: string;
  public readonly scheduledDate: Date;
  public readonly status: OrderStatus;
  public readonly priority: OrderPriority;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(id: OrderId, props: OrderProps) {
    super(id);
    this.identityId = props.identityId;
    this.providerId = props.providerId;
    this.serviceId = props.serviceId;
    this.title = props.title;
    this.description = props.description;
    this.scheduledDate = props.scheduledDate;
    this.status = props.status;
    this.priority = props.priority;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }
}
