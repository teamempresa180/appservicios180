import { ServiceType } from '../../domain/value-objects/service-type.value-object';

/**
 * Input shape for creating a Service. No validation.
 */
export class CreateServiceDto {
  providerId!: string;
  categoryId!: string;
  name!: string;
  description!: string;
  basePrice!: number;
  estimatedDuration!: number;
  type!: ServiceType;
}
