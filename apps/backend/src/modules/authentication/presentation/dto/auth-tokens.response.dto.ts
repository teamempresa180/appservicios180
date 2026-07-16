import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../../../common/auth/role.enum';

/** HTTP response body for `POST /authentications/login` and `POST /authentications/refresh`. */
export class AuthTokensResponseDto {
  @ApiProperty()
  accessToken!: string;

  @ApiProperty()
  refreshToken!: string;

  @ApiProperty({ example: 'Bearer' })
  tokenType!: 'Bearer';

  @ApiProperty({
    example: 900,
    description: 'Access token lifetime in seconds.',
  })
  expiresIn!: number;

  @ApiProperty({ enum: Role })
  role!: Role;
}
