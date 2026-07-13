import { ApiProperty } from '@nestjs/swagger';
import { CredentialType } from '../../domain/value-objects/credential-type.value-object';

/**
 * HTTP request body for `POST /credentials`. Distinct from
 * `application/dto/create-credential.dto.ts` — that DTO is the
 * Application layer's internal input shape, this one is the wire
 * contract exposed to API clients. `CredentialHttpMapper` translates
 * between the two.
 */
export class CreateCredentialRequestDto {
  @ApiProperty({
    description: 'The Identity this credential record belongs to.',
  })
  identityId!: string;

  @ApiProperty({ enum: CredentialType, example: CredentialType.Password })
  type!: CredentialType;
}
