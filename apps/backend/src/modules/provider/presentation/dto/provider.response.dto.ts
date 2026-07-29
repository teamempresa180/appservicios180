import { ApiProperty } from '@nestjs/swagger';
import { ProviderStatus } from '../../domain/value-objects/provider-status.value-object';
import { ProviderType } from '../../domain/value-objects/provider-type.value-object';
import { ProviderExperience } from '../../domain/value-objects/provider-experience.value-object';

/**
 * HTTP response body for the Provider endpoints. Distinct from
 * `application/dto/provider.dto.ts` — see
 * `create-provider.request.dto.ts` for the rationale.
 */
export class ProviderResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  identityId!: string;

  @ApiProperty()
  providerProfileId!: string;

  @ApiProperty({ nullable: true, example: 'category-id-123' })
  categoryId!: string | null;

  @ApiProperty({ nullable: true, example: 'Residential plumbing repairs' })
  specialization!: string | null;

  @ApiProperty({ enum: ProviderStatus })
  status!: ProviderStatus;

  @ApiProperty({ enum: ProviderType })
  type!: ProviderType;

  @ApiProperty({ enum: ProviderExperience })
  experience!: ProviderExperience;

  @ApiProperty({ example: 'Plumber with 10 years of experience.' })
  biography!: string;

  @ApiProperty({ example: 10 })
  yearsOfExperience!: number;

  @ApiProperty({ example: '2026-01-01T00:00:00.000Z', type: String })
  createdAt!: string;

  @ApiProperty({ example: '2026-01-01T00:00:00.000Z', type: String })
  updatedAt!: string;
}
