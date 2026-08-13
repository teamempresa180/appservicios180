import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsString,
  MaxLength,
} from 'class-validator';
import { DocumentType } from '../../domain/value-objects/document-type.value-object';

/**
 * HTTP request body for `POST /identities`. Distinct from
 * `application/dto/create-identity.dto.ts` — that DTO is the
 * Application layer's internal input shape, this one is the wire
 * contract exposed to API clients (documented via `@ApiProperty` for
 * Swagger). `IdentityHttpMapper` translates between the two.
 *
 * Every field carries `class-validator` decorators: the global
 * `ValidationPipe` in `main.ts` runs with `whitelist: true` +
 * `forbidNonWhitelisted: true`, so an undecorated property would be
 * stripped from the payload before it ever reaches the controller.
 */
export class CreateIdentityRequestDto {
  @ApiProperty({
    example: 'Jane Doe',
    description: "The identity's full legal name.",
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  fullName!: string;

  @ApiProperty({ enum: DocumentType, example: DocumentType.NationalId })
  @IsEnum(DocumentType)
  documentType!: DocumentType;

  @ApiProperty({
    example: '1234567890',
    description: 'The document number, unique across all identities.',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(64)
  documentNumber!: string;

  @ApiProperty({
    example: '1990-01-01',
    description: 'ISO 8601 date string.',
    type: String,
  })
  @IsDateString()
  birthDate!: string;
}
