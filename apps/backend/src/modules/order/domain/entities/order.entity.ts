import { Entity } from '../../../core/domain/base/entity.base';
import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';
import { ProviderId } from '../../../provider/domain/value-objects/provider-id.value-object';
import { ServiceId } from '../../../service/domain/value-objects/service-id.value-object';
import { CategoryId } from '../../../category/domain/value-objects/category-id.value-object';
import { AddressId } from '../../../address/domain/value-objects/address-id.value-object';
import { OrderId } from '../value-objects/order-id.value-object';
import { OrderStatus } from '../value-objects/order-status.value-object';
import { OrderPriority } from '../value-objects/order-priority.value-object';

export interface OrderProps {
  identityId: IdentityId;
  providerId: ProviderId | null;
  serviceId: ServiceId | null;
  categoryId: CategoryId;
  addressId: AddressId | null;
  title: string;
  description: string;
  scheduledDate: Date;
  status: OrderStatus;
  priority: OrderPriority;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Represents a customer's request for a service, either a **direct
 * hire** (both `providerId`/`serviceId` set at creation — the client
 * picked a specific provider's specific listed service) or an **open
 * request** (`providerId`/`serviceId` both `null` — the client only
 * chose a `categoryId`; any compatible Provider in that category may
 * submit a `Quote`). An open request's `providerId` is filled in the
 * moment the client accepts one of those Quotes (see
 * `AcceptQuoteUseCase`), at which point it behaves identically to a
 * direct hire from then on — `serviceId` stays `null` forever for an
 * order that started open, since no specific catalog Service was ever
 * chosen. Pure data holder — no payments, no chat, no scheduling
 * logic, no tracking, no reviews, no notifications, no persistence,
 * no business rules.
 */
export class Order extends Entity<OrderId> {
  public readonly identityId: IdentityId;
  public readonly providerId: ProviderId | null;
  public readonly serviceId: ServiceId | null;
  public readonly categoryId: CategoryId;
  public readonly addressId: AddressId | null;
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
    this.categoryId = props.categoryId;
    this.addressId = props.addressId;
    this.title = props.title;
    this.description = props.description;
    this.scheduledDate = props.scheduledDate;
    this.status = props.status;
    this.priority = props.priority;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  /**
   * Returns a new `Order` with the same id, copying every current
   * property except those overridden. Used by use cases that
   * transition status or patch mutable fields without repeating the
   * full property list at each call site.
   */
  public with(overrides: Partial<OrderProps>): Order {
    return new Order(this.id, {
      identityId: this.identityId,
      providerId: this.providerId,
      serviceId: this.serviceId,
      categoryId: this.categoryId,
      addressId: this.addressId,
      title: this.title,
      description: this.description,
      scheduledDate: this.scheduledDate,
      status: this.status,
      priority: this.priority,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      ...overrides,
    });
  }
}
