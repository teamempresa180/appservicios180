import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';
import { ProfileVisibility } from '../../domain/value-objects/profile-visibility.value-object';

/**
 * HTTP request body for `POST /profiles`. Distinct from
 * `application/dto/create-profile.dto.ts` — that DTO is the
 * Application layer's internal input shape, this one is the wire
 * contract exposed to API clients (documented via `@ApiProperty` for
 * Swagger). `ProfileHttpMapper` translates between the two.
 *
 * Every field is decorated: the global `ValidationPipe` runs with
 * `whitelist: true` + `forbidNonWhitelisted: true`, so an undecorated
 * property would be stripped before the controller ever saw it.
 * `bio` is capped at 2000 characters — it is free text rendered on a
 * public profile, and nothing else bounds what a caller can store.
 */
export class CreateProfileRequestDto {
  @ApiProperty({
    example: 'identity-id-123',
    description: 'The id of the Identity this Profile belongs to.',
  })
  @IsUUID()
  identityId!: string;

  @ApiProperty({ example: 'Jane Doe' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  displayName!: string;

  @ApiPropertyOptional({
    example: 'https://cdn.example.com/avatar.png',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  @MaxLength(2048)
  avatarUrl?: string | null;

  @ApiPropertyOptional({
    example: 'Plumber with 10 years of experience.',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  bio?: string | null;

  @ApiProperty({ enum: ProfileVisibility, example: ProfileVisibility.Public })
  @IsEnum(ProfileVisibility)
  visibility!: ProfileVisibility;
}
