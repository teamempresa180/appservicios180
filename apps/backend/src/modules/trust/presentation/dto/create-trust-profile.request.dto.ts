import { ApiProperty } from '@nestjs/swagger';
import { TrustLevel } from '../../domain/value-objects/trust-level.value-object';

/**
 * HTTP request body for `POST /trust-profiles`. Distinct from
 * `application/dto/create-trust-profile.dto.ts` — that DTO is the
 * Application layer's internal input shape, this one is the wire
 * contract exposed to API clients (documented via `@ApiProperty` for
 * Swagger). `TrustHttpMapper` translates between the two.
 */
export class CreateTrustProfileRequestDto {
  @ApiProperty({
    example: 'identity-id-123',
    description: 'The id of the Identity this Trust profile belongs to.',
  })
  identityId!: string;

  @ApiProperty({ example: 75 })
  score!: number;

  @ApiProperty({ enum: TrustLevel, example: TrustLevel.High })
  level!: TrustLevel;
}
