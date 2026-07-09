import { Entity } from '../../../core/domain/base/entity.base';
import { ProviderId } from '../../../provider/domain/value-objects/provider-id.value-object';
import { CategoryId } from '../../../category/domain/value-objects/category-id.value-object';
import { ServiceId } from '../value-objects/service-id.value-object';
import { ServiceStatus } from '../value-objects/service-status.value-object';
import { ServiceType } from '../value-objects/service-type.value-object';

export interface ServiceProps {
  providerId: ProviderId;
  categoryId: CategoryId;
  name: string;
  description: string;
  basePrice: number;
  estimatedDuration: number;
  status: ServiceStatus;
  type: ServiceType;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Represents a service that a Provider offers within a Category.
 * Pure data holder — no availability, no scheduling, no pricing rules, no
 * reviews, no location, no persistence, no business rules.
 */
export class Service extends Entity<ServiceId> {
  public readonly providerId: ProviderId;
  public readonly categoryId: CategoryId;
  public readonly name: string;
  public readonly description: string;
  public readonly basePrice: number;
  public readonly estimatedDuration: number;
  public readonly status: ServiceStatus;
  public readonly type: ServiceType;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(id: ServiceId, props: ServiceProps) {
    super(id);
    this.providerId = props.providerId;
    this.categoryId = props.categoryId;
    this.name = props.name;
    this.description = props.description;
    this.basePrice = props.basePrice;
    this.estimatedDuration = props.estimatedDuration;
    this.status = props.status;
    this.type = props.type;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }
}
