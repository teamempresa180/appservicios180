import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsOptional } from 'class-validator';
import { AvailabilityStatus } from '../../domain/value-objects/availability-status.value-object';

/**
 * HTTP request body for `PUT /availabilities/:id`. Distinct from
 * `application/dto/update-availability.dto.ts` — see
 * `create-availability.request.dto.ts` for the rationale.
 */
export class UpdateAvailabilityRequestDto {
  @ApiPropertyOptional({ example: '2026-01-01T09:00:00.000Z', type: String })
  @IsOptional()
  @IsDateString()
  availableFrom?: string;

  @ApiPropertyOptional({ example: '2026-01-01T17:00:00.000Z', type: String })
  @IsOptional()
  @IsDateString()
  availableTo?: string;

  @ApiPropertyOptional({
    enum: AvailabilityStatus,
    example: AvailabilityStatus.Active,
  })
  @IsOptional()
  @IsEnum(AvailabilityStatus)
  status?: AvailabilityStatus;
}
