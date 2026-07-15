import { ApiProperty } from '@nestjs/swagger';

/**
 * HTTP request body for `POST /reviews`. Distinct from
 * `application/dto/create-review.dto.ts` — that DTO is the
 * Application layer's internal input shape, this one is the wire
 * contract exposed to API clients. `ReviewHttpMapper` translates
 * between the two.
 */
export class CreateReviewRequestDto {
  @ApiProperty({
    example: 'order-id-123',
    description: 'The id of the Order this Review is about.',
  })
  orderId!: string;

  @ApiProperty({
    example: 'provider-id-123',
    description: 'The id of the Provider being reviewed.',
  })
  providerId!: string;

  @ApiProperty({
    example: 'identity-id-123',
    description: 'The id of the Identity writing the review.',
  })
  reviewerIdentityId!: string;

  @ApiProperty({ example: 5 })
  rating!: number;

  @ApiProperty({ example: 'Great service' })
  title!: string;

  @ApiProperty({ example: 'Fixed the leak quickly and left the area clean.' })
  comment!: string;
}
