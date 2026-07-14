import { ApiProperty } from '@nestjs/swagger';
import { ContactType } from '../../domain/value-objects/contact-type.value-object';
import { ContactStatus } from '../../domain/value-objects/contact-status.value-object';

/**
 * HTTP response body for the Contact endpoints. Distinct from
 * `application/dto/contact.dto.ts` — see
 * `create-contact.request.dto.ts` for the rationale.
 */
export class ContactResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  identityId!: string;

  @ApiProperty({ enum: ContactType })
  type!: ContactType;

  @ApiProperty({ example: 'jane.doe@example.com' })
  value!: string;

  @ApiProperty({ enum: ContactStatus })
  status!: ContactStatus;

  @ApiProperty({ example: '2026-01-01T00:00:00.000Z', type: String })
  createdAt!: string;

  @ApiProperty({ example: '2026-01-01T00:00:00.000Z', type: String })
  updatedAt!: string;
}
