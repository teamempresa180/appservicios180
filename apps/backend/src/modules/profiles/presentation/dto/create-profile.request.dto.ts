import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ProfileVisibility } from '../../domain/value-objects/profile-visibility.value-object';

/**
 * HTTP request body for `POST /profiles`. Distinct from
 * `application/dto/create-profile.dto.ts` — that DTO is the
 * Application layer's internal input shape, this one is the wire
 * contract exposed to API clients (documented via `@ApiProperty` for
 * Swagger). `ProfileHttpMapper` translates between the two.
 */
export class CreateProfileRequestDto {
  @ApiProperty({
    example: 'identity-id-123',
    description: 'The id of the Identity this Profile belongs to.',
  })
  identityId!: string;

  @ApiProperty({ example: 'Jane Doe' })
  displayName!: string;

  @ApiPropertyOptional({
    example: 'https://cdn.example.com/avatar.png',
    nullable: true,
  })
  avatarUrl?: string | null;

  @ApiPropertyOptional({
    example: 'Plumber with 10 years of experience.',
    nullable: true,
  })
  bio?: string | null;

  @ApiProperty({ enum: ProfileVisibility, example: ProfileVisibility.Public })
  visibility!: ProfileVisibility;
}
