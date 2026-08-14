import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

/** HTTP request body for `POST /authentications/logout`. Same cap as
 *  `RefreshRequestDto` — both are public and take a refresh token. */
export class LogoutRequestDto {
  @ApiProperty({ description: 'The refresh token to revoke.' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(1024)
  refreshToken!: string;
}
