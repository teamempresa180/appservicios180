import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { OrderPriority } from '../../domain/value-objects/order-priority.value-object';

/**
 * HTTP request body for `PUT /orders/:id`. Distinct from
 * `application/dto/update-order.dto.ts` — see
 * `create-order.request.dto.ts` for the rationale, including why
 * every field needs `class-validator` decorators. Only mirrors the
 * fields `UpdateOrderCommand` actually accepts (title/description/
 * scheduledDate/priority) — `status` is not updatable via this
 * endpoint (see `PUT /orders/:id/cancel` for the only supported
 * status transition), per the existing Application layer contract.
 * Every field is optional (a partial update), but a field that *is*
 * present must satisfy the same bounds as on create.
 */
export class UpdateOrderRequestDto {
  @ApiPropertyOptional({ example: 'Fix leaking kitchen faucet', maxLength: 150 })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  title?: string;

  @ApiPropertyOptional({ example: 'Updated description.', maxLength: 2000 })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  description?: string;

  @ApiPropertyOptional({ example: '2026-02-02T09:00:00.000Z', type: String })
  @IsOptional()
  @IsDateString()
  scheduledDate?: string;

  @ApiPropertyOptional({ enum: OrderPriority, example: OrderPriority.High })
  @IsOptional()
  @IsEnum(OrderPriority)
  priority?: OrderPriority;
}
