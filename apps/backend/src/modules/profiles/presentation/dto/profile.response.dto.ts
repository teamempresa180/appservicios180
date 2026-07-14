import { ApiProperty } from '@nestjs/swagger';
import { ProfileVisibility } from '../../domain/value-objects/profile-visibility.value-object';
import { ProfileStatus } from '../../domain/value-objects/profile-status.value-object';

/**
 * HTTP response body for the Profile endpoints. Distinct from
 * `application/dto/profile.dto.ts` — see
 * `create-profile.request.dto.ts` for the rationale.
 */
export class ProfileResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  identityId!: string;

  @ApiProperty({ example: 'Jane Doe' })
  displayName!: string;

  @ApiProperty({
    example: 'https://cdn.example.com/avatar.png',
    nullable: true,
    type: String,
  })
  avatarUrl!: string | null;

  @ApiProperty({
    example: 'Plumber with 10 years of experience.',
    nullable: true,
    type: String,
  })
  bio!: string | null;

  @ApiProperty({ enum: ProfileVisibility })
  visibility!: ProfileVisibility;

  @ApiProperty({ enum: ProfileStatus })
  status!: ProfileStatus;

  @ApiProperty({ example: '2026-01-01T00:00:00.000Z', type: String })
  createdAt!: string;

  @ApiProperty({ example: '2026-01-01T00:00:00.000Z', type: String })
  updatedAt!: string;
}
