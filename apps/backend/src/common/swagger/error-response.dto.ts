import { ApiProperty } from '@nestjs/swagger';

/**
 * Swagger schema mirroring `ErrorResponse` (`common/filters/error-response.ts`)
 * — the shape every global exception filter responds with. Referenced
 * by controllers' `@ApiResponse` error entries so every endpoint's
 * error documentation stays consistent instead of each module
 * re-describing the same shape.
 */
export class ErrorResponseDto {
  @ApiProperty({ example: 404 })
  statusCode!: number;

  @ApiProperty({ example: 'NotFoundException' })
  error!: string;

  @ApiProperty({ example: 'Identity 123 not found' })
  message!: string;

  @ApiProperty({ example: '2026-01-01T00:00:00.000Z' })
  timestamp!: string;

  @ApiProperty({ example: '/identities/123' })
  path!: string;
}
