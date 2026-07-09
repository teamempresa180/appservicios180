import { ServiceStatus } from '../../domain/value-objects/service-status.value-object';
import { ServiceType } from '../../domain/value-objects/service-type.value-object';

/**
 * Output shape returned by queries and use cases.
 */
export class ServiceDto {
  id!: string;
  providerId!: string;
  categoryId!: string;
  name!: string;
  description!: string;
  basePrice!: number;
  estimatedDuration!: number;
  status!: ServiceStatus;
  type!: ServiceType;
  createdAt!: Date;
  updatedAt!: Date;
}
