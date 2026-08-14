import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsUUID } from 'class-validator';
import { AuthMethodType } from '../../domain/value-objects/auth-method-type.value-object';

/**
 * HTTP request body for `POST /authentications`. Distinct from
 * `application/dto/create-authentication.dto.ts` — that DTO is the
 * Application layer's internal input shape, this one is the wire
 * contract exposed to API clients. `AuthenticationHttpMapper`
 * translates between the two.
 *
 * Every field is decorated: the global `ValidationPipe` runs with
 * `whitelist: true` + `forbidNonWhitelisted: true`, so an undecorated
 * property would be stripped before the controller ever saw it.
 */
export class CreateAuthenticationRequestDto {
  @ApiProperty({
    description: 'The Identity this authentication method belongs to.',
  })
  @IsUUID()
  identityId!: string;

  @ApiProperty({ enum: AuthMethodType, example: AuthMethodType.Password })
  @IsEnum(AuthMethodType)
  methodType!: AuthMethodType;
}
