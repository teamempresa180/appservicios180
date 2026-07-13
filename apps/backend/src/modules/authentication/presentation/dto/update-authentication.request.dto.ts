import { ApiPropertyOptional } from '@nestjs/swagger';
import { AuthenticationStatus } from '../../domain/value-objects/authentication-status.value-object';

/**
 * HTTP request body for `PUT /authentications/:id`. Distinct from
 * `application/dto/update-authentication.dto.ts` — see
 * `create-authentication.request.dto.ts` for the rationale.
 */
export class UpdateAuthenticationRequestDto {
  @ApiPropertyOptional({
    enum: AuthenticationStatus,
    example: AuthenticationStatus.Active,
  })
  status?: AuthenticationStatus;
}
