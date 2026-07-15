import { ApiProperty } from '@nestjs/swagger';
import { PaymentResponseDto } from './payment.response.dto';

/**
 * HTTP response body for `GET /payments` (paginated list). Wraps
 * `PaymentResponseDto[]` with the same pagination metadata shape as
 * `PaginatedResult<T>` (`core/application/paginated-result.ts`),
 * re-declared here purely for Swagger documentation of the HTTP
 * contract.
 */
export class PaymentListResponseDto {
  @ApiProperty({ type: [PaymentResponseDto] })
  items!: PaymentResponseDto[];

  @ApiProperty({ example: 42 })
  total!: number;

  @ApiProperty({ example: 1 })
  page!: number;

  @ApiProperty({ example: 20 })
  pageSize!: number;
}
