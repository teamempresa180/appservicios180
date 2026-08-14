import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import {
  MAX_REVIEW_RATING,
  MIN_REVIEW_RATING,
} from '../../domain/value-objects/review-rating.value-object';

/**
 * HTTP request body for `POST /reviews`. Distinct from
 * `application/dto/create-review.dto.ts` — that DTO is the
 * Application layer's internal input shape, this one is the wire
 * contract exposed to API clients. `ReviewHttpMapper` translates
 * between the two.
 *
 * `rating` is bounded to the 1..5 star scale here *and* in
 * `ReviewRating` — the DTO turns a bad value into a clean 400 at the
 * edge with the offending field named, while the value object
 * guarantees the rule holds no matter which path constructs a
 * Review. The bounds are imported from the value object so the two
 * cannot drift apart.
 */
export class CreateReviewRequestDto {
  @ApiProperty({
    example: '7c9e6679-7425-40de-944b-e07fc1f90ae7',
    description: 'The id of the Order this Review is about.',
  })
  @IsUUID()
  orderId!: string;

  @ApiProperty({
    example: '1b2c3d4e-5f6a-4b7c-8d9e-0f1a2b3c4d5e',
    description: 'The id of the Provider being reviewed.',
  })
  @IsUUID()
  providerId!: string;

  @ApiProperty({
    example: '3f1c9d5e-6a1b-4f2c-9d3e-8b7a6c5d4e3f',
    description: 'The id of the Identity writing the review.',
  })
  @IsUUID()
  reviewerIdentityId!: string;

  @ApiProperty({
    example: 5,
    minimum: MIN_REVIEW_RATING,
    maximum: MAX_REVIEW_RATING,
    description: 'Whole number of stars, 1 to 5.',
  })
  @IsInt()
  @Min(MIN_REVIEW_RATING)
  @Max(MAX_REVIEW_RATING)
  rating!: number;

  @ApiProperty({ example: 'Great service', maxLength: 100 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  title!: string;

  @ApiProperty({
    example: 'Fixed the leak quickly and left the area clean.',
    maxLength: 1000,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  comment!: string;
}
