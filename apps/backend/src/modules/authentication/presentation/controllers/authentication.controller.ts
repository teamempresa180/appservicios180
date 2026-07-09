import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthenticationRoutes } from '../routes/authentication.routes';
import { AuthenticationSwagger } from '../swagger/authentication.swagger';
import { CreateAuthenticationUseCase } from '../../application/use_cases/create-authentication.use-case';
import { UpdateAuthenticationUseCase } from '../../application/use_cases/update-authentication.use-case';
import { DeleteAuthenticationUseCase } from '../../application/use_cases/delete-authentication.use-case';
import { GetAuthenticationUseCase } from '../../application/use_cases/get-authentication.use-case';
import { CreateAuthenticationDto } from '../../application/dto/create-authentication.dto';
import { UpdateAuthenticationDto } from '../../application/dto/update-authentication.dto';
import { CreateAuthenticationCommand } from '../../application/commands/create-authentication.command';
import { UpdateAuthenticationCommand } from '../../application/commands/update-authentication.command';
import { DeleteAuthenticationCommand } from '../../application/commands/delete-authentication.command';
import { GetAuthenticationQuery } from '../../application/queries/get-authentication.query';

/**
 * REST controller for Authentication. Only exposes routes and delegates to
 * the corresponding Use Case — no business logic lives here. Use Cases are
 * not implemented yet, so every call currently rejects with "Not implemented yet".
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
  @ApiResponse({ status: 201, description: 'Authentication method created.' })
  create(@Body() dto: CreateAuthenticationDto) {
    return this.createAuthenticationUseCase.execute(
      new CreateAuthenticationCommand(dto.identityId, dto.methodType),
    );
  }

  @Put(AuthenticationRoutes.byId)
  @ApiOperation(AuthenticationSwagger.update)
  @ApiResponse({ status: 200, description: 'Authentication method updated.' })
  update(@Param('id') id: string, @Body() dto: UpdateAuthenticationDto) {
    return this.updateAuthenticationUseCase.execute(
      new UpdateAuthenticationCommand(id, dto.status),
    );
  }

  @Delete(AuthenticationRoutes.byId)
  @ApiOperation(AuthenticationSwagger.delete)
  @ApiResponse({ status: 200, description: 'Authentication method deleted.' })
  remove(@Param('id') id: string) {
    return this.deleteAuthenticationUseCase.execute(
      new DeleteAuthenticationCommand(id),
    );
  }

  @Get(AuthenticationRoutes.byId)
  @ApiOperation(AuthenticationSwagger.get)
  @ApiResponse({ status: 200, description: 'Authentication method found.' })
  findOne(@Param('id') id: string) {
    return this.getAuthenticationUseCase.execute(
      new GetAuthenticationQuery(id),
    );
  }
}
