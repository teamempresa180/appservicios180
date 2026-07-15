import { ApiProperty } from '@nestjs/swagger';
import { TrustLevel } from '../../domain/value-objects/trust-level.value-object';
import { TrustStatus } from '../../domain/value-objects/trust-status.value-object';

/**
 * HTTP response body for the Trust endpoints. Distinct from
 * `application/dto/trust.dto.ts` — see
 * `create-trust-profile.request.dto.ts` for the rationale.
 */
export class TrustResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  identityId!: string;

  @ApiProperty({ example: 75 })
  score!: number;

  @ApiProperty({ enum: TrustLevel })
  level!: TrustLevel;

  @ApiProperty({ enum: TrustStatus })
  status!: TrustStatus;

  @ApiProperty({ example: '2026-01-01T00:00:00.000Z', type: String })
  createdAt!: string;

  @ApiProperty({ example: '2026-01-01T00:00:00.000Z', type: String })
  updatedAt!: string;
}
