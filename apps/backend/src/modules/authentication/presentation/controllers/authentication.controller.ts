import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ErrorResponseDto } from '../../../../common/swagger/error-response.dto';
import { AuthenticationRoutes } from '../routes/authentication.routes';
import { AuthenticationSwagger } from '../swagger/authentication.swagger';
import { CreateAuthenticationUseCase } from '../../application/use_cases/create-authentication.use-case';
import { UpdateAuthenticationUseCase } from '../../application/use_cases/update-authentication.use-case';
import { DeleteAuthenticationUseCase } from '../../application/use_cases/delete-authentication.use-case';
import { GetAuthenticationUseCase } from '../../application/use_cases/get-authentication.use-case';
import { DeleteAuthenticationCommand } from '../../application/commands/delete-authentication.command';
import { GetAuthenticationQuery } from '../../application/queries/get-authentication.query';
import { CreateAuthenticationRequestDto } from '../dto/create-authentication.request.dto';
import { UpdateAuthenticationRequestDto } from '../dto/update-authentication.request.dto';
import { AuthenticationResponseDto } from '../dto/authentication.response.dto';
import { AuthenticationHttpMapper } from '../dto/authentication-http.mapper';

/**
 * REST controller for Authentication. Only exposes routes, maps HTTP
 * DTOs to Application commands/queries via `AuthenticationHttpMapper`,
 * and delegates to the corresponding Use Case — no business logic
 * lives here. Domain exceptions are translated to HTTP responses by
 * the global `DomainExceptionFilter`, registered in `main.ts` — this
 * controller never catches them itself.
 */
@ApiTags('Authentication')
@Controller(AuthenticationRoutes.base)
export class AuthenticationController {
  constructor(
    private readonly createAuthenticationUseCase: CreateAuthenticationUseCase,
    private readonly updateAuthenticationUseCase: UpdateAuthenticationUseCase,
    private readonly deleteAuthenticationUseCase: DeleteAuthenticationUseCase,
    private readonly getAuthenticationUseCase: GetAuthenticationUseCase,
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
