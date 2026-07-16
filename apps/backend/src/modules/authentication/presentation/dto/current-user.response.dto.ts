import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../../../common/auth/role.enum';

/** HTTP response body for `GET /authentications/me`. */
export class CurrentUserResponseDto {
  @ApiProperty({ description: 'The authenticated Identity id.' })
  id!: string;

  @ApiProperty({ enum: Role })
  role!: Role;
}
