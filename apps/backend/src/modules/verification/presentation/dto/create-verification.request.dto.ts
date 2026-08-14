import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsUUID } from 'class-validator';
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
    example: '7c9e6679-7425-40de-944b-e07fc1f90ae7',
    description:
      'The id of the Identity this Verification belongs to — must be the authenticated caller.',
  })
  @IsUUID()
  identityId!: string;

  @ApiProperty({ enum: VerificationType, example: VerificationType.Document })
  @IsEnum(VerificationType)
  type!: VerificationType;
}
