import { ApiProperty } from '@nestjs/swagger';
import { DocumentType } from '../../domain/value-objects/document-type.value-object';
import { IdentityStatus } from '../../domain/value-objects/identity-status.value-object';

/**
 * HTTP response body for the Identity endpoints. Distinct from
 * `application/dto/identity.dto.ts` — see
 * `create-identity.request.dto.ts` for the rationale.
 */
export class IdentityResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty({ example: 'Jane Doe' })
  fullName!: string;

  @ApiProperty({ enum: DocumentType })
  documentType!: DocumentType;

  @ApiProperty({ example: '1234567890' })
  documentNumber!: string;

  @ApiProperty({ example: '1990-01-01T00:00:00.000Z', type: String })
  birthDate!: string;

  @ApiProperty({ enum: IdentityStatus })
  status!: IdentityStatus;

  @ApiProperty({ example: '2026-01-01T00:00:00.000Z', type: String })
  createdAt!: string;

  @ApiProperty({ example: '2026-01-01T00:00:00.000Z', type: String })
  updatedAt!: string;
}
