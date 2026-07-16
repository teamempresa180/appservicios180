import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ErrorResponseDto } from '../../../../common/swagger/error-response.dto';
import { JwtAuthGuard } from '../../../../common/auth/jwt-auth.guard';
import { CurrentUser } from '../../../../common/auth/current-user.decorator';
import type { AuthenticatedUser } from '../../../../common/auth/authenticated-user.interface';
import { AuthenticationRoutes } from '../routes/authentication.routes';
import { AuthenticationSwagger } from '../swagger/authentication.swagger';
import { CreateAuthenticationUseCase } from '../../application/use_cases/create-authentication.use-case';
import { UpdateAuthenticationUseCase } from '../../application/use_cases/update-authentication.use-case';
import { DeleteAuthenticationUseCase } from '../../application/use_cases/delete-authentication.use-case';
import { GetAuthenticationUseCase } from '../../application/use_cases/get-authentication.use-case';
import { LoginUseCase } from '../../application/use_cases/login.use-case';
import { RefreshUseCase } from '../../application/use_cases/refresh.use-case';
import { LogoutUseCase } from '../../application/use_cases/logout.use-case';
import { DeleteAuthenticationCommand } from '../../application/commands/delete-authentication.command';
import { GetAuthenticationQuery } from '../../application/queries/get-authentication.query';
import { CreateAuthenticationRequestDto } from '../dto/create-authentication.request.dto';
import { UpdateAuthenticationRequestDto } from '../dto/update-authentication.request.dto';
import { AuthenticationResponseDto } from '../dto/authentication.response.dto';
import { AuthenticationHttpMapper } from '../dto/authentication-http.mapper';
import { LoginRequestDto } from '../dto/login.request.dto';
import { RefreshRequestDto } from '../dto/refresh.request.dto';
import { LogoutRequestDto } from '../dto/logout.request.dto';
import { AuthTokensResponseDto } from '../dto/auth-tokens.response.dto';
import { CurrentUserResponseDto } from '../dto/current-user.response.dto';
import { AuthSessionHttpMapper } from '../dto/auth-session-http.mapper';

/**
 * REST controller for Authentication. Only exposes routes, maps HTTP
 * DTOs to Application commands/queries via `AuthenticationHttpMapper`/
 * `AuthSessionHttpMapper`, and delegates to the corresponding Use
 * Case — no business logic lives here. Domain exceptions are
 * translated to HTTP responses by the global `DomainExceptionFilter`,
 * registered in `main.ts` — this controller never catches them
 * itself.
 *
 * `login`/`refresh`/`logout`/`me` (Sprint 4, Etapa 7) are declared
 * before the dynamic `findOne(:id)` route so `GET /authentications/me`
 * resolves to `me()` rather than being matched as
 * `findOne({ id: 'me' })` — same reasoning as `search` in every other
 * module since Prompt 71. `me` is the only endpoint here guarded by
 * `JwtAuthGuard`; `login`/`refresh`/`logout` are intentionally public
 * (a caller without a token is exactly who needs them).
 */
@ApiTags('Authentication')
@Controller(AuthenticationRoutes.base)
export class AuthenticationController {
  constructor(
    private readonly createAuthenticationUseCase: CreateAuthenticationUseCase,
    private readonly updateAuthenticationUseCase: UpdateAuthenticationUseCase,
    private readonly deleteAuthenticationUseCase: DeleteAuthenticationUseCase,
    private readonly getAuthenticationUseCase: GetAuthenticationUseCase,
    private readonly loginUseCase: LoginUseCase,
    private readonly refreshUseCase: RefreshUseCase,
    private readonly logoutUseCase: LogoutUseCase,
  ) {}

  @Post()
  @ApiOperation(AuthenticationSwagger.create)
  @ApiResponse({
    status: 201,
    description: 'Authentication method created.',
    type: AuthenticationResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error.',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Identity not found.',
    type: ErrorResponseDto,
  })
  async create(
    @Body() dto: CreateAuthenticationRequestDto,
  ): Promise<AuthenticationResponseDto> {
    const authentication = await this.createAuthenticationUseCase.execute(
      AuthenticationHttpMapper.toCreateCommand(dto),
    );
    return AuthenticationHttpMapper.toResponse(authentication);
  }

  @Put(AuthenticationRoutes.byId)
  @ApiOperation(AuthenticationSwagger.update)
  @ApiParam({ name: 'id', description: 'Authentication method id' })
  @ApiResponse({
    status: 200,
    description: 'Authentication method updated.',
    type: AuthenticationResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error.',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Authentication method not found.',
    type: ErrorResponseDto,
  })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateAuthenticationRequestDto,
  ): Promise<AuthenticationResponseDto> {
    const authentication = await this.updateAuthenticationUseCase.execute(
      AuthenticationHttpMapper.toUpdateCommand(id, dto),
    );
    return AuthenticationHttpMapper.toResponse(authentication);
  }

  @Delete(AuthenticationRoutes.byId)
  @ApiOperation(AuthenticationSwagger.delete)
  @ApiParam({ name: 'id', description: 'Authentication method id' })
  @ApiResponse({ status: 200, description: 'Authentication method deleted.' })
  @ApiResponse({
    status: 404,
    description: 'Authentication method not found.',
    type: ErrorResponseDto,
  })
  async remove(@Param('id') id: string): Promise<void> {
    await this.deleteAuthenticationUseCase.execute(
      new DeleteAuthenticationCommand(id),
    );
  }

  @Post(AuthenticationRoutes.login)
  @HttpCode(200)
  @ApiOperation(AuthenticationSwagger.login)
  @ApiResponse({
    status: 200,
    description: 'Logged in.',
    type: AuthTokensResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid document number or password.',
    type: ErrorResponseDto,
  })
  async login(@Body() dto: LoginRequestDto): Promise<AuthTokensResponseDto> {
    const tokens = await this.loginUseCase.execute(
      AuthSessionHttpMapper.toLoginCommand(dto),
    );
    return AuthSessionHttpMapper.toTokensResponse(tokens);
  }

  @Post(AuthenticationRoutes.refresh)
  @HttpCode(200)
  @ApiOperation(AuthenticationSwagger.refresh)
  @ApiResponse({
    status: 200,
    description: 'New access/refresh pair issued.',
    type: AuthTokensResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Refresh token is invalid, expired, or already used.',
    type: ErrorResponseDto,
  })
  async refresh(
    @Body() dto: RefreshRequestDto,
  ): Promise<AuthTokensResponseDto> {
    const tokens = await this.refreshUseCase.execute(
      AuthSessionHttpMapper.toRefreshCommand(dto),
    );
    return AuthSessionHttpMapper.toTokensResponse(tokens);
  }

  @Post(AuthenticationRoutes.logout)
  @HttpCode(200)
  @ApiOperation(AuthenticationSwagger.logout)
  @ApiResponse({ status: 200, description: 'Logged out.' })
  async logout(@Body() dto: LogoutRequestDto): Promise<void> {
    await this.logoutUseCase.execute(
      AuthSessionHttpMapper.toLogoutCommand(dto),
    );
  }

  @Get(AuthenticationRoutes.me)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation(AuthenticationSwagger.me)
  @ApiResponse({
    status: 200,
    description: 'The authenticated Identity.',
    type: CurrentUserResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Missing or invalid access token.',
    type: ErrorResponseDto,
  })
  me(@CurrentUser() user: AuthenticatedUser): CurrentUserResponseDto {
    return AuthSessionHttpMapper.toCurrentUserResponse(user);
  }

  @Get(AuthenticationRoutes.byId)
  @ApiOperation(AuthenticationSwagger.get)
  @ApiParam({ name: 'id', description: 'Authentication method id' })
  @ApiResponse({
    status: 200,
    description: 'Authentication method found.',
    type: AuthenticationResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Authentication method not found.',
    type: ErrorResponseDto,
  })
  async findOne(@Param('id') id: string): Promise<AuthenticationResponseDto> {
    const authentication = await this.getAuthenticationUseCase.execute(
      new GetAuthenticationQuery(id),
    );
    return AuthenticationHttpMapper.toResponse(authentication);
  }
}
