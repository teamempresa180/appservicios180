import { ApiProperty } from '@nestjs/swagger';
import { ContactResponseDto } from './contact.response.dto';

/**
 * HTTP response body for `GET /contacts` (paginated list). Wraps
 * `ContactResponseDto[]` with the same pagination metadata shape as
 * `PaginatedResult<T>` (`core/application/paginated-result.ts`),
 * re-declared here purely for Swagger documentation of the HTTP
 * contract — the Application layer's `PaginatedResult<T>` is not a
 * DTO and is never referenced directly by the presentation layer.
 */
export class ContactListResponseDto {
  @ApiProperty({ type: [ContactResponseDto] })
  items!: ContactResponseDto[];

  @ApiProperty({ example: 42 })
  total!: number;

  @ApiProperty({ example: 1 })
  page!: number;

  @ApiProperty({ example: 20 })
  pageSize!: number;
}
