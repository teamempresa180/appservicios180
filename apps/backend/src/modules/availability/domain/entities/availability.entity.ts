import { Entity } from '../../../core/domain/base/entity.base';
import { ProviderId } from '../../../provider/domain/value-objects/provider-id.value-object';
import { AvailabilityId } from '../value-objects/availability-id.value-object';
import { AvailabilityStatus } from '../value-objects/availability-status.value-object';
import { AvailabilityType } from '../value-objects/availability-type.value-object';

export interface AvailabilityProps {
  providerId: ProviderId;
  status: AvailabilityStatus;
  type: AvailabilityType;
  availableFrom: Date;
  availableTo: Date;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Represents the general availability of a provider to render services.
 * Pure data holder — no schedule, no bookings, no specific time slots, no
 * vacations, no zones, no persistence, no business rules.
 */
export class Availability extends Entity<AvailabilityId> {
  public readonly providerId: ProviderId;
  public readonly status: AvailabilityStatus;
  public readonly type: AvailabilityType;
  public readonly availableFrom: Date;
  public readonly availableTo: Date;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(id: AvailabilityId, props: AvailabilityProps) {
    super(id);
    this.providerId = props.providerId;
    this.status = props.status;
    this.type = props.type;
    this.availableFrom = props.availableFrom;
    this.availableTo = props.availableTo;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }
}
