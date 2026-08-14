import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { ProviderType } from '../../domain/value-objects/provider-type.value-object';
import { ProviderExperience } from '../../domain/value-objects/provider-experience.value-object';

/**
 * HTTP request body for `POST /providers`. Distinct from
 * `application/dto/create-provider.dto.ts` — that DTO is the
 * Application layer's internal input shape, this one is the wire
 * contract exposed to API clients (documented via `@ApiProperty` for
 * Swagger). `ProviderHttpMapper` translates between the two.
 *
 * Every field carries class-validator decorators: the global
 * `ValidationPipe` runs with `whitelist`/`forbidNonWhitelisted`, so an
 * undecorated field would be stripped from the payload before the
 * controller ever saw it.
 *
 * Reference ids are validated as bounded non-empty strings rather than
 * `@IsUUID()`. Ids in this system are not uniformly UUIDs — the
 * catalog rows shipped by `prisma/seed.ts` use slugs such as
 * `seed-category-1`, and `CategoryId`/`IdentityId` accept any string —
 * so a UUID constraint would reject ids the API itself hands out.
 */
export class CreateProviderRequestDto {
  @ApiProperty({
    example: 'identity-id-123',
    description: 'The id of the Identity this Provider belongs to.',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(64)
  identityId!: string;

  @ApiProperty({
    example: 'profile-id-123',
    description: "The id of the Identity's Profile used for this Provider.",
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(64)
  providerProfileId!: string;

  @ApiProperty({ enum: ProviderType, example: ProviderType.Independent })
  @IsEnum(ProviderType)
  type!: ProviderType;

  @ApiProperty({
    enum: ProviderExperience,
    example: ProviderExperience.Intermediate,
  })
  @IsEnum(ProviderExperience)
  experience!: ProviderExperience;

  @ApiProperty({ example: 'Plumber with 10 years of experience.' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  biography!: string;

  @ApiProperty({ example: 10 })
  @IsInt()
  @Min(0)
  yearsOfExperience!: number;

  @ApiPropertyOptional({
    example: 'category-id-123',
    description: 'The Category this Provider specializes in, if chosen.',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(64)
  categoryId?: string;

  @ApiPropertyOptional({
    example: 'specialization-id-123',
    description:
      'The real Specialization within `categoryId` this Provider offers (see GET /categories/:categoryId/specializations). Requires categoryId.',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(64)
  specializationId?: string;
}
