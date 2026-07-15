import { ApiProperty } from '@nestjs/swagger';
import { VerificationType } from '../../domain/value-objects/verification-type.value-object';

/**
 * HTTP request body for `POST /verifications`. Distinct from
 * `application/dto/create-verification.dto.ts` — that DTO is the
 * Application layer's internal input shape, this one is the wire
 * contract exposed to API clients (documented via `@ApiProperty` for
 * Swagger). `VerificationHttpMapper` translates between the two.
 */
export class CreateVerificationRequestDto {
  @ApiProperty({
    example: 'identity-id-123',
    description: 'The id of the Identity this Verification belongs to.',
  })
  identityId!: string;

  @ApiProperty({ enum: VerificationType, example: VerificationType.Document })
  type!: VerificationType;
}
