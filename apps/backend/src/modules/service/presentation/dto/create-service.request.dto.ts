import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { ServiceType } from '../../domain/value-objects/service-type.value-object';

/**
 * HTTP request body for `POST /services`. Distinct from
 * `application/dto/create-service.dto.ts` — that DTO is the
 * Application layer's internal input shape, this one is the wire
 * contract exposed to API clients (documented via `@ApiProperty` for
 * Swagger). `ServiceHttpMapper` translates between the two.
 *
 * Every field carries class-validator decorators: the global
 * `ValidationPipe` runs with `whitelist`/`forbidNonWhitelisted`, so an
 * undecorated field would be stripped before reaching the controller.
 * See `create-provider.request.dto.ts` for why reference ids are
 * bounded strings rather than `@IsUUID()`.
 */
export class CreateServiceRequestDto {
  @ApiProperty({
    example: 'provider-id-123',
    description: 'The id of the Provider offering this Service.',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(64)
  providerId!: string;

  @ApiProperty({
    example: 'category-id-123',
    description: 'The id of the Category this Service belongs to.',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(64)
  categoryId!: string;

  @ApiProperty({ example: 'Pipe repair' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name!: string;

  @ApiProperty({ example: 'Fixes leaking or broken pipes.' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  description!: string;

  /** Must be strictly positive — a free or negatively priced service is not a real offer. */
  @ApiProperty({ example: 50.0 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  basePrice!: number;

  /** Whole minutes: the backing Prisma column is an `Int`, so a decimal would be silently truncated. */
  @ApiProperty({ example: 60, description: 'Estimated duration in minutes.' })
  @IsInt()
  @Min(1)
  estimatedDuration!: number;

  @ApiProperty({ enum: ServiceType, example: ServiceType.Standard })
  @IsEnum(ServiceType)
  type!: ServiceType;
}
