import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';
import { CredentialType } from '../../domain/value-objects/credential-type.value-object';

/**
 * HTTP request body for `POST /credentials`. Distinct from
 * `application/dto/create-credential.dto.ts` — that DTO is the
 * Application layer's internal input shape, this one is the wire
 * contract exposed to API clients. `CredentialHttpMapper` translates
 * between the two. `password` is required when `type` is `PASSWORD`
 * (a cross-field rule `class-validator` can't express on its own, so
 * `CredentialValidator` still enforces it) — never logged or echoed
 * back; only its hash is ever persisted.
 *
 * Every field is decorated: the global `ValidationPipe` runs with
 * `whitelist: true` + `forbidNonWhitelisted: true`, so an undecorated
 * property would be stripped before the controller ever sees it.
 * `@MaxLength(256)` on `password` also caps the input bcrypt has to
 * hash, so this public endpoint can't be used to burn CPU with
 * megabyte-long passwords.
 */
export class CreateCredentialRequestDto {
  @ApiProperty({
    description: 'The Identity this credential record belongs to.',
  })
  @IsUUID()
  identityId!: string;

  @ApiProperty({ enum: CredentialType, example: CredentialType.Password })
  @IsEnum(CredentialType)
  type!: CredentialType;

  @ApiPropertyOptional({
    description: 'Required when type is PASSWORD. Minimum 8 characters.',
    example: 'Str0ngPassw0rd!',
  })
  @IsOptional()
  @IsString()
  @MinLength(8)
  @MaxLength(256)
  password?: string;
}
