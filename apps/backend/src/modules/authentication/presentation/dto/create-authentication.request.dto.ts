import { ApiProperty } from '@nestjs/swagger';
import { AuthMethodType } from '../../domain/value-objects/auth-method-type.value-object';

/**
 * HTTP request body for `POST /authentications`. Distinct from
 * `application/dto/create-authentication.dto.ts` — that DTO is the
 * Application layer's internal input shape, this one is the wire
 * contract exposed to API clients. `AuthenticationHttpMapper`
 * translates between the two.
 */
export class CreateAuthenticationRequestDto {
  @ApiProperty({
    description: 'The Identity this authentication method belongs to.',
  })
  identityId!: string;

  @ApiProperty({ enum: AuthMethodType, example: AuthMethodType.Password })
  methodType!: AuthMethodType;
}
