import { ApiPropertyOptional } from '@nestjs/swagger';
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
  @ApiPropertyOptional({ example: 55.0 })
  basePrice?: number;

  @ApiPropertyOptional({ example: 45 })
  estimatedDuration?: number;

  @ApiPropertyOptional({ enum: ServiceStatus, example: ServiceStatus.Active })
  status?: ServiceStatus;
}
