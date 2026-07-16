import { ApiProperty } from '@nestjs/swagger';

/** HTTP request body for `POST /authentications/logout`. */
export class LogoutRequestDto {
  @ApiProperty({ description: 'The refresh token to revoke.' })
  refreshToken!: string;
}
