import { ApiProperty } from '@nestjs/swagger';
import { DocumentType } from '../../domain/value-objects/document-type.value-object';

/**
 * HTTP request body for `POST /identities`. Distinct from
 * `application/dto/create-identity.dto.ts` — that DTO is the
 * Application layer's internal input shape, this one is the wire
 * contract exposed to API clients (documented via `@ApiProperty` for
 * Swagger). `IdentityHttpMapper` translates between the two.
 */
export class CreateIdentityRequestDto {
  @ApiProperty({
    example: 'Jane Doe',
    description: "The identity's full legal name.",
  })
  fullName!: string;

  @ApiProperty({ enum: DocumentType, example: DocumentType.NationalId })
  documentType!: DocumentType;

  @ApiProperty({
    example: '1234567890',
    description: 'The document number, unique per documentType.',
  })
  documentNumber!: string;

  @ApiProperty({
    example: '1990-01-01',
    description: 'ISO 8601 date string.',
    type: String,
  })
  birthDate!: string;
}
