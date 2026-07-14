import { ApiProperty } from '@nestjs/swagger';
import { ContactType } from '../../domain/value-objects/contact-type.value-object';

/**
 * HTTP request body for `POST /contacts`. Distinct from
 * `application/dto/create-contact.dto.ts` — that DTO is the
 * Application layer's internal input shape, this one is the wire
 * contract exposed to API clients (documented via `@ApiProperty` for
 * Swagger). `ContactHttpMapper` translates between the two.
 */
export class CreateContactRequestDto {
  @ApiProperty({
    example: 'identity-id-123',
    description: 'The id of the Identity this Contact belongs to.',
  })
  identityId!: string;

  @ApiProperty({ enum: ContactType, example: ContactType.Email })
  type!: ContactType;

  @ApiProperty({ example: 'jane.doe@example.com' })
  value!: string;
}
