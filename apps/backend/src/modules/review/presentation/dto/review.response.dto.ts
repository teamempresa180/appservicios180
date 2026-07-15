import { ApiProperty } from '@nestjs/swagger';
import { ReviewStatus } from '../../domain/value-objects/review-status.value-object';

/**
 * HTTP response body for the Review endpoints. Distinct from
 * `application/dto/review.dto.ts` — see
 * `create-review.request.dto.ts` for the rationale.
 */
export class ReviewResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  orderId!: string;

  @ApiProperty()
  providerId!: string;

  @ApiProperty()
  reviewerIdentityId!: string;

  @ApiProperty({ example: 5 })
  rating!: number;

  @ApiProperty({ example: 'Great service' })
  title!: string;

  @ApiProperty({ example: 'Fixed the leak quickly and left the area clean.' })
  comment!: string;

  @ApiProperty({ enum: ReviewStatus })
  status!: ReviewStatus;

  @ApiProperty({ example: '2026-01-01T00:00:00.000Z', type: String })
  createdAt!: string;

  @ApiProperty({ example: '2026-01-01T00:00:00.000Z', type: String })
  updatedAt!: string;
}
