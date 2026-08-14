import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ContactType } from '../../domain/value-objects/contact-type.value-object';

/**
 * HTTP request body for `POST /contacts`. Distinct from
 * `application/dto/create-contact.dto.ts` — that DTO is the
 * Application layer's internal input shape, this one is the wire
 * contract exposed to API clients (documented via `@ApiProperty` for
 * Swagger). `ContactHttpMapper` translates between the two.
 *
 * Every field carries `class-validator` decorators: the global
 * `ValidationPipe` runs with `whitelist`/`forbidNonWhitelisted`, so an
 * undecorated field would be stripped from the payload rather than
 * reaching the Use Case. Whether `value` actually looks like an email
 * or a phone number depends on `type`, which is a cross-field rule and
 * lives in `ContactValidator`.
 */
export class CreateContactRequestDto {
  @ApiProperty({
    example: 'identity-id-123',
    description: 'The id of the Identity this Contact belongs to.',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(64)
  identityId!: string;

  @ApiProperty({ enum: ContactType, example: ContactType.Email })
  @IsEnum(ContactType)
  type!: ContactType;

  @ApiProperty({ example: 'jane.doe@example.com' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  value!: string;
}
