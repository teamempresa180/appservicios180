import { ApiProperty } from '@nestjs/swagger';
import { AttachmentResponseDto } from './attachment.response.dto';

/**
 * HTTP response body for `GET /attachments` (paginated list). Wraps
 * `AttachmentResponseDto[]` with the same pagination metadata shape
 * as `PaginatedResult<T>` (`core/application/paginated-result.ts`),
 * re-declared here purely for Swagger documentation of the HTTP
 * contract.
 */
export class AttachmentListResponseDto {
  @ApiProperty({ type: [AttachmentResponseDto] })
  items!: AttachmentResponseDto[];

  @ApiProperty({ example: 42 })
  total!: number;

  @ApiProperty({ example: 1 })
  page!: number;

  @ApiProperty({ example: 20 })
  pageSize!: number;
}
