import { ApiPropertyOptional } from '@nestjs/swagger';
import { CredentialStatus } from '../../domain/value-objects/credential-status.value-object';

/**
 * HTTP request body for `PUT /credentials/:id`. Distinct from
 * `application/dto/update-credential.dto.ts` — see
 * `create-credential.request.dto.ts` for the rationale.
 */
export class UpdateCredentialRequestDto {
  @ApiPropertyOptional({
    enum: CredentialStatus,
    example: CredentialStatus.Active,
  })
  status?: CredentialStatus;
}
