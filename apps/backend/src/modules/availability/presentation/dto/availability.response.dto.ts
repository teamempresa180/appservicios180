import { ApiProperty } from '@nestjs/swagger';
import { AvailabilityStatus } from '../../domain/value-objects/availability-status.value-object';
import { AvailabilityType } from '../../domain/value-objects/availability-type.value-object';

/**
 * HTTP response body for the Availability endpoints. Distinct from
 * `application/dto/availability.dto.ts` — see
 * `create-availability.request.dto.ts` for the rationale.
 */
export class AvailabilityResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  providerId!: string;

  @ApiProperty({ enum: AvailabilityStatus })
  status!: AvailabilityStatus;

  @ApiProperty({ enum: AvailabilityType })
  type!: AvailabilityType;

  @ApiProperty({ example: '2026-01-01T08:00:00.000Z', type: String })
  availableFrom!: string;

  @ApiProperty({ example: '2026-01-01T18:00:00.000Z', type: String })
  availableTo!: string;

  @ApiProperty({ example: '2026-01-01T00:00:00.000Z', type: String })
  createdAt!: string;

  @ApiProperty({ example: '2026-01-01T00:00:00.000Z', type: String })
  updatedAt!: string;
}
