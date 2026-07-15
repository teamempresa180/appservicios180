import { ApiProperty } from '@nestjs/swagger';
import { ServiceStatus } from '../../domain/value-objects/service-status.value-object';
import { ServiceType } from '../../domain/value-objects/service-type.value-object';

/**
 * HTTP response body for the Service endpoints. Distinct from
 * `application/dto/service.dto.ts` — see
 * `create-service.request.dto.ts` for the rationale.
 */
export class ServiceResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  providerId!: string;

  @ApiProperty()
  categoryId!: string;

  @ApiProperty({ example: 'Pipe repair' })
  name!: string;

  @ApiProperty({ example: 'Fixes leaking or broken pipes.' })
  description!: string;

  @ApiProperty({ example: 50.0 })
  basePrice!: number;

  @ApiProperty({ example: 60 })
  estimatedDuration!: number;

  @ApiProperty({ enum: ServiceStatus })
  status!: ServiceStatus;

  @ApiProperty({ enum: ServiceType })
  type!: ServiceType;

  @ApiProperty({ example: '2026-01-01T00:00:00.000Z', type: String })
  createdAt!: string;

  @ApiProperty({ example: '2026-01-01T00:00:00.000Z', type: String })
  updatedAt!: string;
}
