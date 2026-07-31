import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ProviderType } from '../../domain/value-objects/provider-type.value-object';
import { ProviderExperience } from '../../domain/value-objects/provider-experience.value-object';

/**
 * HTTP request body for `POST /providers`. Distinct from
 * `application/dto/create-provider.dto.ts` — that DTO is the
 * Application layer's internal input shape, this one is the wire
 * contract exposed to API clients (documented via `@ApiProperty` for
 * Swagger). `ProviderHttpMapper` translates between the two.
 */
export class CreateProviderRequestDto {
  @ApiProperty({
    example: 'identity-id-123',
    description: 'The id of the Identity this Provider belongs to.',
  })
  identityId!: string;

  @ApiProperty({
    example: 'profile-id-123',
    description: "The id of the Identity's Profile used for this Provider.",
  })
  providerProfileId!: string;

  @ApiProperty({ enum: ProviderType, example: ProviderType.Independent })
  type!: ProviderType;

  @ApiProperty({
    enum: ProviderExperience,
    example: ProviderExperience.Intermediate,
  })
  experience!: ProviderExperience;

  @ApiProperty({ example: 'Plumber with 10 years of experience.' })
  biography!: string;

  @ApiProperty({ example: 10 })
  yearsOfExperience!: number;

  @ApiPropertyOptional({
    example: 'category-id-123',
    description: 'The Category this Provider specializes in, if chosen.',
  })
  categoryId?: string;

  @ApiPropertyOptional({
    example: 'specialization-id-123',
    description:
      'The real Specialization within `categoryId` this Provider offers (see GET /categories/:categoryId/specializations). Requires categoryId.',
  })
  specializationId?: string;
}
