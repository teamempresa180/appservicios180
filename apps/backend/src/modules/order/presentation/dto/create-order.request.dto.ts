import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';
import { OrderPriority } from '../../domain/value-objects/order-priority.value-object';

/**
 * HTTP request body for `POST /orders`. Distinct from
 * `application/dto/create-order.dto.ts` — that DTO is the
 * Application layer's internal input shape, this one is the wire
 * contract exposed to API clients (documented via `@ApiProperty` for
 * Swagger). `OrderHttpMapper` translates between the two.
 * `providerId`/`serviceId` are optional together: omit both for an
 * **open request** (any Provider in `categoryId` may quote it),
 * provide both for a **direct hire** of a specific Provider's
 * specific Service.
 *
 * Every field carries `class-validator` decorators: the global
 * `ValidationPipe` runs with `whitelist`/`forbidNonWhitelisted`, so an
 * undecorated field would be stripped from the payload (or reject the
 * whole request) before any Use Case sees it. The reference ids are
 * `@IsUUID()` because that is what `crypto.randomUUID()` produces for
 * every entity in this codebase — the length/format caps here also
 * stop oversized strings from reaching the `VARCHAR` columns.
 * `OrderValidator.validateCreate` still owns the one rule this layer
 * cannot express: `providerId`/`serviceId` must be present or absent
 * *together*.
 */
export class CreateOrderRequestDto {
  @ApiProperty({
    example: '3f1c9d5e-6a1b-4f2c-9d3e-8b7a6c5d4e3f',
    description: 'The id of the customer Identity requesting the Order.',
  })
  @IsUUID()
  identityId!: string;

  @ApiProperty({
    example: '9a8b7c6d-5e4f-4a3b-2c1d-0e9f8a7b6c5d',
    description: 'The id of the Category this request belongs to.',
  })
  @IsUUID()
  categoryId!: string;

  @ApiPropertyOptional({
    example: '1b2c3d4e-5f6a-4b7c-8d9e-0f1a2b3c4d5e',
    description:
      'The id of the Provider fulfilling the Order (direct hire only).',
  })
  @IsOptional()
  @IsUUID()
  providerId?: string;

  @ApiPropertyOptional({
    example: '2c3d4e5f-6a7b-4c8d-9e0f-1a2b3c4d5e6f',
    description: 'The id of the Service being ordered (direct hire only).',
  })
  @IsOptional()
  @IsUUID()
  serviceId?: string;

  @ApiPropertyOptional({
    example: '4d5e6f7a-8b9c-4d0e-1f2a-3b4c5d6e7f8a',
    description:
      "The id of the client's Address where the service will take place, used to build navigation directions for the Provider.",
  })
  @IsOptional()
  @IsUUID()
  addressId?: string;

  @ApiProperty({ example: 'Fix leaking kitchen faucet', maxLength: 150 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  title!: string;

  @ApiProperty({
    example: 'The faucet under the kitchen sink has been leaking for a week.',
    maxLength: 2000,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  description!: string;

  @ApiProperty({ example: '2026-02-01T09:00:00.000Z', type: String })
  @IsDateString()
  scheduledDate!: string;

  @ApiProperty({ enum: OrderPriority, example: OrderPriority.Medium })
  @IsEnum(OrderPriority)
  priority!: OrderPriority;
}
