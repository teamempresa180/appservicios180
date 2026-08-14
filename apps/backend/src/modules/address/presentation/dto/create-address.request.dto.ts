import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { AddressType } from '../../domain/value-objects/address-type.value-object';

/**
 * HTTP request body for `POST /addresses`. Distinct from
 * `application/dto/create-address.dto.ts` — that DTO is the
 * Application layer's internal input shape, this one is the wire
 * contract exposed to API clients (documented via `@ApiProperty` for
 * Swagger). `AddressHttpMapper` translates between the two.
 *
 * Every field carries `class-validator` decorators: the global
 * `ValidationPipe` runs with `whitelist`/`forbidNonWhitelisted`, so an
 * undecorated field would be stripped from the payload rather than
 * reaching the Use Case.
 *
 * `latitude`/`longitude` are individually optional here — the
 * "both or neither" rule is cross-field and stays in
 * `AddressValidator`.
 */
export class CreateAddressRequestDto {
  @ApiProperty({
    example: 'identity-id-123',
    description: 'The id of the Identity this Address belongs to.',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(64)
  identityId!: string;

  @ApiProperty({ example: 'Home' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  alias!: string;

  @ApiProperty({ example: 'Calle 123 #45-67' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(300)
  fullAddress!: string;

  @ApiProperty({ example: 'Bogotá' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  city!: string;

  @ApiProperty({ example: 'Cundinamarca' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  state!: string;

  @ApiProperty({ example: 'Colombia' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  country!: string;

  @ApiProperty({ example: '110111' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  postalCode!: string;

  @ApiPropertyOptional({
    example: 4.710989,
    description:
      'Latitude of the pin dropped on the map picker (-90..90). Must be provided together with `longitude`, or omitted entirely.',
  })
  @IsOptional()
  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude?: number;

  @ApiPropertyOptional({
    example: -74.072092,
    description:
      'Longitude of the pin dropped on the map picker (-180..180). Must be provided together with `latitude`, or omitted entirely.',
  })
  @IsOptional()
  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude?: number;

  @ApiProperty({ enum: AddressType, example: AddressType.Home })
  @IsEnum(AddressType)
  type!: AddressType;
}
