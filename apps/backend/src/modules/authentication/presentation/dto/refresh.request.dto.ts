import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

/** HTTP request body for `POST /authentications/refresh`. Public
 *  endpoint, so the token is length-capped before it reaches the
 *  hashing/lookup path — see `LoginRequestDto`. */
export class RefreshRequestDto {
  @ApiProperty({
    description: 'A previously issued, not-yet-used refresh token.',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(1024)
  refreshToken!: string;
}
