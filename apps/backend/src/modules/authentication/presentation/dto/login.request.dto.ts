import { ApiProperty } from '@nestjs/swagger';

/**
 * HTTP request body for `POST /authentications/login`. `documentNumber`
 * is the login identifier (Sprint 4, Etapa 7 decision — `Identity`
 * already has this field, no new one needed).
 */
export class LoginRequestDto {
  @ApiProperty({ example: '123456789' })
  documentNumber!: string;

  @ApiProperty({ example: 'Str0ngPassw0rd!' })
  password!: string;
}
