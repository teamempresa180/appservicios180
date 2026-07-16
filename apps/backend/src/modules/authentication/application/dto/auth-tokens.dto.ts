import { Role } from '../../../../common/auth/role.enum';

/** Output shape returned by Login/Refresh. */
export class AuthTokensDto {
  accessToken!: string;
  refreshToken!: string;
  tokenType!: 'Bearer';
  expiresIn!: number;
  role!: Role;
}
