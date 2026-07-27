import { ApiProperty } from '@nestjs/swagger';
import { VerificationType } from '../../domain/value-objects/verification-type.value-object';
import { VerificationStatus } from '../../domain/value-objects/verification-status.value-object';

/**
 * HTTP response body for the Verification endpoints. Distinct from
 * `application/dto/verification.dto.ts` — see
 * `create-verification.request.dto.ts` for the rationale.
 */
export class VerificationResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  identityId!: string;

  @ApiProperty({ enum: VerificationType })
  type!: VerificationType;

  @ApiProperty({ enum: VerificationStatus })
  status!: VerificationStatus;

  @ApiProperty({
    example: '2026-01-01T00:00:00.000Z',
    type: String,
    nullable: true,
  })
  verifiedAt!: string | null;

  @ApiProperty({ example: '2026-01-01T00:00:00.000Z', type: String })
  createdAt!: string;

  @ApiProperty({ example: '2026-01-01T00:00:00.000Z', type: String })
  updatedAt!: string;

  @ApiProperty({
    example: 'uploads/verifications/id-1/criminal-record.pdf',
    type: String,
    nullable: true,
    description:
      'Relative path to the uploaded document, reachable at GET /<documentPath>. Null until POST /verifications/:id/document is called.',
  })
  documentPath!: string | null;
}
