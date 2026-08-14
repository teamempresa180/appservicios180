import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

/**
 * HTTP request body for `POST /authentications/login`. `documentNumber`
 * is the login identifier (Sprint 4, Etapa 7 decision — `Identity`
 * already has this field, no new one needed).
 *
 * Both fields are length-capped: this endpoint is public, and
 * `password` reaches bcrypt, so an uncapped value would let a caller
 * spend server CPU at will. No `@MinLength` on `password` — login must
 * answer a short wrong password with the same 401 as any other wrong
 * password, never a 400 that would tell an attacker their guess was
 * merely malformed.
 */
export class LoginRequestDto {
  @ApiProperty({ example: '123456789' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(64)
  documentNumber!: string;

  @ApiProperty({ example: 'Str0ngPassw0rd!' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(256)
  password!: string;
}
