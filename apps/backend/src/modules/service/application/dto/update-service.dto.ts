import { ServiceStatus } from '../../domain/value-objects/service-status.value-object';

/**
 * Input shape for updating a Service. No validation.
 */
export class UpdateServiceDto {
  name?: string;
  description?: string;
  basePrice?: number;
  estimatedDuration?: number;
  status?: ServiceStatus;
}
