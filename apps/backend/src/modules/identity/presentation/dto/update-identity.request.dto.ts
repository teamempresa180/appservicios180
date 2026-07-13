import { ApiPropertyOptional } from '@nestjs/swagger';
import { IdentityStatus } from '../../domain/value-objects/identity-status.value-object';

/**
 * HTTP request body for `PUT /identities/:id`. Distinct from
 * `application/dto/update-identity.dto.ts` — see
 * `create-identity.request.dto.ts` for the rationale.
 */
export class UpdateIdentityRequestDto {
  @ApiPropertyOptional({ example: 'Jane Doe' })
  fullName?: string;

  @ApiPropertyOptional({ enum: IdentityStatus, example: IdentityStatus.Active })
  status?: IdentityStatus;
}
