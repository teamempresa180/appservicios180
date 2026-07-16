import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CredentialType } from '../../domain/value-objects/credential-type.value-object';

/**
 * HTTP request body for `POST /credentials`. Distinct from
 * `application/dto/create-credential.dto.ts` — that DTO is the
 * Application layer's internal input shape, this one is the wire
 * contract exposed to API clients. `CredentialHttpMapper` translates
 * between the two. `password` is required when `type` is `PASSWORD`
 * (enforced by `CredentialValidator`, not here) — never logged or
 * echoed back; only its hash is ever persisted.
 */
export class CreateCredentialRequestDto {
  @ApiProperty({
    description: 'The Identity this credential record belongs to.',
  })
  identityId!: string;

  @ApiProperty({ enum: CredentialType, example: CredentialType.Password })
  type!: CredentialType;

  @ApiPropertyOptional({
    description: 'Required when type is PASSWORD. Minimum 8 characters.',
    example: 'Str0ngPassw0rd!',
  })
  password?: string;
}
