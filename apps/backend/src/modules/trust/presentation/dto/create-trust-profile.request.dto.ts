import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsUUID, Max, Min } from 'class-validator';
import { TrustLevel } from '../../domain/value-objects/trust-level.value-object';
import {
  MAX_TRUST_SCORE,
  MIN_TRUST_SCORE,
} from '../../application/validators/trust.validator';

/**
 * HTTP request body for `POST /trust-profiles`. Distinct from
 * `application/dto/create-trust-profile.dto.ts` — that DTO is the
 * Application layer's internal input shape, this one is the wire
 * contract exposed to API clients (documented via `@ApiProperty` for
 * Swagger). `TrustHttpMapper` translates between the two.
 *
 * Every field is decorated: the global `ValidationPipe` runs with
 * `whitelist`/`forbidNonWhitelisted`, so an undecorated property would
 * be stripped from the payload before the controller ever sees it.
 */
export class CreateTrustProfileRequestDto {
  @ApiProperty({
    example: '7c9e6679-7425-40de-944b-e07fc1f90ae7',
    description:
      'The id of the Identity this Trust profile belongs to — must be the authenticated caller.',
  })
  @IsUUID()
  identityId!: string;

  @ApiProperty({
    example: 75,
    minimum: MIN_TRUST_SCORE,
    maximum: MAX_TRUST_SCORE,
  })
  @IsInt()
  @Min(MIN_TRUST_SCORE)
  @Max(MAX_TRUST_SCORE)
  score!: number;

  @ApiProperty({ enum: TrustLevel, example: TrustLevel.High })
  @IsEnum(TrustLevel)
  level!: TrustLevel;
}
