import { ApiProperty } from '@nestjs/swagger';
import { CredentialType } from '../../domain/value-objects/credential-type.value-object';
import { CredentialStatus } from '../../domain/value-objects/credential-status.value-object';

/**
 * HTTP response body for the Credentials endpoints. Distinct from
 * `application/dto/credential.dto.ts` — see
 * `create-credential.request.dto.ts` for the rationale.
 */
export class CredentialResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  identityId!: string;

  @ApiProperty({ enum: CredentialType })
  type!: CredentialType;

  @ApiProperty({ enum: CredentialStatus })
  status!: CredentialStatus;

  @ApiProperty({ example: '2026-01-01T00:00:00.000Z', type: String })
  createdAt!: string;

  @ApiProperty({ example: '2026-01-01T00:00:00.000Z', type: String })
  updatedAt!: string;
}
