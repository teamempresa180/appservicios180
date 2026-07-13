import { ApiProperty } from '@nestjs/swagger';
import { AuthMethodType } from '../../domain/value-objects/auth-method-type.value-object';
import { AuthenticationStatus } from '../../domain/value-objects/authentication-status.value-object';

/**
 * HTTP response body for the Authentication endpoints. Distinct from
 * `application/dto/authentication.dto.ts` — see
 * `create-authentication.request.dto.ts` for the rationale.
 */
export class AuthenticationResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  identityId!: string;

  @ApiProperty({ enum: AuthMethodType })
  methodType!: AuthMethodType;

  @ApiProperty({ enum: AuthenticationStatus })
  status!: AuthenticationStatus;

  @ApiProperty({ example: '2026-01-01T00:00:00.000Z', type: String })
  createdAt!: string;

  @ApiProperty({ example: '2026-01-01T00:00:00.000Z', type: String })
  updatedAt!: string;
}
