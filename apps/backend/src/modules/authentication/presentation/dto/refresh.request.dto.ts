import { ApiProperty } from '@nestjs/swagger';

/** HTTP request body for `POST /authentications/refresh`. */
export class RefreshRequestDto {
  @ApiProperty({
    description: 'A previously issued, not-yet-used refresh token.',
  })
  refreshToken!: string;
}
