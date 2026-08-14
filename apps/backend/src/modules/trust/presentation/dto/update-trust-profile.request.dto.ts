import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';
import { TrustLevel } from '../../domain/value-objects/trust-level.value-object';
import { TrustStatus } from '../../domain/value-objects/trust-status.value-object';
import {
  MAX_TRUST_SCORE,
  MIN_TRUST_SCORE,
} from '../../application/validators/trust.validator';

/**
 * HTTP request body for `PUT /trust-profiles/:id`. Distinct from
 * `application/dto/update-trust-profile.dto.ts` — see
 * `create-trust-profile.request.dto.ts` for the rationale.
 *
 * The endpoint carrying this body is Admin-only: `score` is the
 * marketplace's reputation signal, so it must never be settable by the
 * user it describes.
 */
export class UpdateTrustProfileRequestDto {
  @ApiPropertyOptional({
    example: 80,
    minimum: MIN_TRUST_SCORE,
    maximum: MAX_TRUST_SCORE,
  })
  @IsOptional()
  @IsInt()
  @Min(MIN_TRUST_SCORE)
  @Max(MAX_TRUST_SCORE)
  score?: number;

  @ApiPropertyOptional({ enum: TrustLevel, example: TrustLevel.VeryHigh })
  @IsOptional()
  @IsEnum(TrustLevel)
  level?: TrustLevel;

  @ApiPropertyOptional({ enum: TrustStatus, example: TrustStatus.Active })
  @IsOptional()
  @IsEnum(TrustStatus)
  status?: TrustStatus;
}
