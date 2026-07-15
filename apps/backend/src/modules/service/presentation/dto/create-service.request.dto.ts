import { ApiProperty } from '@nestjs/swagger';
import { ServiceType } from '../../domain/value-objects/service-type.value-object';

/**
 * HTTP request body for `POST /services`. Distinct from
 * `application/dto/create-service.dto.ts` — that DTO is the
 * Application layer's internal input shape, this one is the wire
 * contract exposed to API clients (documented via `@ApiProperty` for
 * Swagger). `ServiceHttpMapper` translates between the two.
 */
export class CreateServiceRequestDto {
  @ApiProperty({
    example: 'provider-id-123',
    description: 'The id of the Provider offering this Service.',
  })
  providerId!: string;

  @ApiProperty({
    example: 'category-id-123',
    description: 'The id of the Category this Service belongs to.',
  })
  categoryId!: string;

  @ApiProperty({ example: 'Pipe repair' })
  name!: string;

  @ApiProperty({ example: 'Fixes leaking or broken pipes.' })
  description!: string;

  @ApiProperty({ example: 50.0 })
  basePrice!: number;

  @ApiProperty({ example: 60, description: 'Estimated duration in minutes.' })
  estimatedDuration!: number;

  @ApiProperty({ enum: ServiceType, example: ServiceType.Standard })
  type!: ServiceType;
}
