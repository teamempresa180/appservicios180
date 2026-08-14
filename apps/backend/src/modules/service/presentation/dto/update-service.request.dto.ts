import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsNumber, IsOptional, Min } from 'class-validator';
import { ServiceStatus } from '../../domain/value-objects/service-status.value-object';

/**
 * HTTP request body for `PUT /services/:id`. Distinct from
 * `application/dto/update-service.dto.ts` — see
 * `create-service.request.dto.ts` for the rationale. Only mirrors the
 * fields `UpdateServiceCommand` actually accepts (basePrice/
 * estimatedDuration/status) — name/description are not updatable, per
 * the existing Application layer contract.
 */
export class UpdateServiceRequestDto {
  /** Must be strictly positive — see `create-service.request.dto.ts`. */
  @ApiPropertyOptional({ example: 55.0 })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  basePrice?: number;

  /** Whole minutes — the backing Prisma column is an `Int`. */
  @ApiPropertyOptional({ example: 45 })
  @IsOptional()
  @IsInt()
  @Min(1)
  estimatedDuration?: number;

  @ApiPropertyOptional({ enum: ServiceStatus, example: ServiceStatus.Active })
  @IsOptional()
  @IsEnum(ServiceStatus)
  status?: ServiceStatus;
}
