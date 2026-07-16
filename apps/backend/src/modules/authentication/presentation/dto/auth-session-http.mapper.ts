import { AuthenticatedUser } from '../../../../common/auth/authenticated-user.interface';
import { LoginCommand } from '../../application/commands/login.command';
import { RefreshCommand } from '../../application/commands/refresh.command';
import { LogoutCommand } from '../../application/commands/logout.command';
import { AuthTokensDto } from '../../application/dto/auth-tokens.dto';
import { LoginRequestDto } from './login.request.dto';
import { RefreshRequestDto } from './refresh.request.dto';
import { LogoutRequestDto } from './logout.request.dto';
import { AuthTokensResponseDto } from './auth-tokens.response.dto';
import { CurrentUserResponseDto } from './current-user.response.dto';

/**
 * Translates between the HTTP-facing login/refresh/logout/me DTOs
 * (this folder) and the Application layer's commands/DTOs — kept
 * separate from `AuthenticationHttpMapper` (the CRUD mapper) since
 * these are a distinct set of translations with no shared fields.
 */
export class AuthSessionHttpMapper {
  static toLoginCommand(dto: LoginRequestDto): LoginCommand {
    return new LoginCommand(dto.documentNumber, dto.password);
  }

  static toRefreshCommand(dto: RefreshRequestDto): RefreshCommand {
    return new RefreshCommand(dto.refreshToken);
  }

  static toLogoutCommand(dto: LogoutRequestDto): LogoutCommand {
    return new LogoutCommand(dto.refreshToken);
  }

  static toTokensResponse(dto: AuthTokensDto): AuthTokensResponseDto {
    const response = new AuthTokensResponseDto();
    response.accessToken = dto.accessToken;
    response.refreshToken = dto.refreshToken;
    response.tokenType = dto.tokenType;
    response.expiresIn = dto.expiresIn;
    response.role = dto.role;
    return response;
  }

  static toCurrentUserResponse(
    user: AuthenticatedUser,
  ): CurrentUserResponseDto {
    const response = new CurrentUserResponseDto();
    response.id = user.id;
    response.role = user.role;
    return response;
  }
}
