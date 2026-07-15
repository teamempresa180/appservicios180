import { ApiPropertyOptional } from '@nestjs/swagger';
import { TrustLevel } from '../../domain/value-objects/trust-level.value-object';
import { TrustStatus } from '../../domain/value-objects/trust-status.value-object';

/**
 * HTTP request body for `PUT /trust-profiles/:id`. Distinct from
 * `application/dto/update-trust-profile.dto.ts` — see
 * `create-trust-profile.request.dto.ts` for the rationale.
 */
export class UpdateTrustProfileRequestDto {
  @ApiPropertyOptional({ example: 80 })
  score?: number;

  @ApiPropertyOptional({ enum: TrustLevel, example: TrustLevel.VeryHigh })
  level?: TrustLevel;

  @ApiPropertyOptional({ enum: TrustStatus, example: TrustStatus.Active })
  status?: TrustStatus;
}
