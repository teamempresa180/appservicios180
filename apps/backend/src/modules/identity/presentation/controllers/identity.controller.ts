import {
  Body,
  Controller,
  Delete,
  Get,
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
import { Throttle } from '@nestjs/throttler';
import { ErrorResponseDto } from '../../../../common/swagger/error-response.dto';
import { JwtAuthGuard } from '../../../../common/auth/jwt-auth.guard';
import { IdentityRoutes } from '../routes/identity.routes';
import { IdentitySwagger } from '../swagger/identity.swagger';
import { CreateIdentityUseCase } from '../../application/use_cases/create-identity.use-case';
import { UpdateIdentityUseCase } from '../../application/use_cases/update-identity.use-case';
import { DeleteIdentityUseCase } from '../../application/use_cases/delete-identity.use-case';
import { GetIdentityUseCase } from '../../application/use_cases/get-identity.use-case';
import { DeleteIdentityCommand } from '../../application/commands/delete-identity.command';
import { GetIdentityQuery } from '../../application/queries/get-identity.query';
import { CreateIdentityRequestDto } from '../dto/create-identity.request.dto';
import { UpdateIdentityRequestDto } from '../dto/update-identity.request.dto';
import { IdentityResponseDto } from '../dto/identity.response.dto';
import { IdentityHttpMapper } from '../dto/identity-http.mapper';

/**
 * REST controller for Identity. Only exposes routes, maps HTTP DTOs
 * to Application commands/queries via `IdentityHttpMapper`, and
 * delegates to the corresponding Use Case — no business logic lives
 * here. Domain exceptions thrown by Use Cases (`NotFoundException`,
 * `ValidationException`) are translated to HTTP responses by the
 * global `DomainExceptionFilter` (`common/filters/`), registered in
 * `main.ts` — this controller never catches them itself.
 *
 * `create` is intentionally the one public (unguarded) endpoint here
 * (Prompt 78, Security Hardening) — it is the registration entry
 * point: a brand-new Identity has no credential and no token yet, so
 * requiring `JwtAuthGuard` on it would make sign-up impossible.
 * `update`/`delete`/`findOne` all require an existing session.
 */
@ApiTags('Identity')
@Controller(IdentityRoutes.base)
export class IdentityController {
  constructor(
    private readonly createIdentityUseCase: CreateIdentityUseCase,
    private readonly updateIdentityUseCase: UpdateIdentityUseCase,
    private readonly deleteIdentityUseCase: DeleteIdentityUseCase,
    private readonly getIdentityUseCase: GetIdentityUseCase,
  ) {}

  @Post()
  // Public registration entry point — throttled against automated
  // mass account creation (same rationale as login/refresh).
  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  @ApiOperation(IdentitySwagger.create)
  @ApiResponse({
    status: 201,
    description: 'Identity created.',
    type: IdentityResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error.',
    type: ErrorResponseDto,
  })
  async create(
    @Body() dto: CreateIdentityRequestDto,
  ): Promise<IdentityResponseDto> {
    const identity = await this.createIdentityUseCase.execute(
      IdentityHttpMapper.toCreateCommand(dto),
    );
    return IdentityHttpMapper.toResponse(identity);
  }

  @Put(IdentityRoutes.byId)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation(IdentitySwagger.update)
  @ApiParam({ name: 'id', description: 'Identity id' })
  @ApiResponse({
    status: 200,
    description: 'Identity updated.',
    type: IdentityResponseDto,
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
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateIdentityRequestDto,
  ): Promise<IdentityResponseDto> {
    const identity = await this.updateIdentityUseCase.execute(
      IdentityHttpMapper.toUpdateCommand(id, dto),
    );
    return IdentityHttpMapper.toResponse(identity);
  }

  @Delete(IdentityRoutes.byId)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation(IdentitySwagger.delete)
  @ApiParam({ name: 'id', description: 'Identity id' })
  @ApiResponse({ status: 200, description: 'Identity deleted.' })
  @ApiResponse({
    status: 404,
    description: 'Identity not found.',
    type: ErrorResponseDto,
  })
  async remove(@Param('id') id: string): Promise<void> {
    await this.deleteIdentityUseCase.execute(new DeleteIdentityCommand(id));
  }

  @Get(IdentityRoutes.byId)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation(IdentitySwagger.get)
  @ApiParam({ name: 'id', description: 'Identity id' })
  @ApiResponse({
    status: 200,
    description: 'Identity found.',
    type: IdentityResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Identity not found.',
    type: ErrorResponseDto,
  })
  async findOne(@Param('id') id: string): Promise<IdentityResponseDto> {
    const identity = await this.getIdentityUseCase.execute(
      new GetIdentityQuery(id),
    );
    return IdentityHttpMapper.toResponse(identity);
  }
}
