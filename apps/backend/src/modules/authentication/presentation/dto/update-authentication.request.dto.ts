import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { AuthenticationStatus } from '../../domain/value-objects/authentication-status.value-object';

/**
 * HTTP request body for `PUT /authentications/:id`. Distinct from
 * `application/dto/update-authentication.dto.ts` — see
 * `create-authentication.request.dto.ts` for the rationale, including
 * why every field must be decorated.
 */
export class UpdateAuthenticationRequestDto {
  @ApiPropertyOptional({
    enum: AuthenticationStatus,
    example: AuthenticationStatus.Active,
  })
  @IsOptional()
  @IsEnum(AuthenticationStatus)
  status?: AuthenticationStatus;
}
