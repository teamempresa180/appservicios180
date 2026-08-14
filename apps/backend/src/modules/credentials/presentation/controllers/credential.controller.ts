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
import { RolesGuard } from '../../../../common/auth/roles.guard';
import { CurrentUser } from '../../../../common/auth/current-user.decorator';
import type { AuthenticatedUser } from '../../../../common/auth/authenticated-user.interface';
import { CredentialRoutes } from '../routes/credential.routes';
import { CredentialSwagger } from '../swagger/credential.swagger';
import { CreateCredentialUseCase } from '../../application/use_cases/create-credential.use-case';
import { UpdateCredentialUseCase } from '../../application/use_cases/update-credential.use-case';
import { DeleteCredentialUseCase } from '../../application/use_cases/delete-credential.use-case';
import { GetCredentialUseCase } from '../../application/use_cases/get-credential.use-case';
import { DeleteCredentialCommand } from '../../application/commands/delete-credential.command';
import { GetCredentialQuery } from '../../application/queries/get-credential.query';
import { CreateCredentialRequestDto } from '../dto/create-credential.request.dto';
import { UpdateCredentialRequestDto } from '../dto/update-credential.request.dto';
import { CredentialResponseDto } from '../dto/credential.response.dto';
import { CredentialHttpMapper } from '../dto/credential-http.mapper';

/**
 * REST controller for Credential. Only exposes routes, maps HTTP DTOs
 * to Application commands/queries via `CredentialHttpMapper`, and
 * delegates to the corresponding Use Case — no business logic lives
 * here. Domain exceptions are translated to HTTP responses by the
 * global `DomainExceptionFilter`, registered in `main.ts` — this
 * controller never catches them itself.
 *
 * `create` is intentionally the one public (unguarded) endpoint here
 * (Prompt 78, Security Hardening) — setting the initial password
 * credential is part of the same registration step as
 * `POST /identities`, before any token exists. Being public, it is
 * throttled like `login` (5/minute per IP) and refuses to create a
 * second `Password` credential for an Identity that already has one —
 * see `CreateCredentialUseCase` for the account-takeover this closes.
 *
 * `update`/`delete`/`findOne` require an existing session *and* are
 * scoped to the caller's own Credential records: each passes
 * `@CurrentUser()` down to its Use Case, which answers 403 for anyone
 * else's. `RolesGuard` sits next to `JwtAuthGuard` on every guarded
 * route; no route here needs a specific role, since Customers and
 * Providers alike own their own credentials.
 */
@ApiTags('Credentials')
@Controller(CredentialRoutes.base)
export class CredentialController {
  constructor(
    private readonly createCredentialUseCase: CreateCredentialUseCase,
    private readonly updateCredentialUseCase: UpdateCredentialUseCase,
    private readonly deleteCredentialUseCase: DeleteCredentialUseCase,
    private readonly getCredentialUseCase: GetCredentialUseCase,
  ) {}

  @Post()
  // Public registration entry point, and the one place a password is
  // ever accepted for a brand-new account — throttled at the same rate
  // as `login` so it can't be driven at scale (mass credential
  // creation, or bcrypt-hashing as a CPU sink).
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @ApiOperation(CredentialSwagger.create)
  @ApiResponse({
    status: 201,
    description: 'Credential created.',
    type: CredentialResponseDto,
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
  @ApiResponse({
    status: 422,
    description: 'This Identity already has a password credential.',
    type: ErrorResponseDto,
  })
  async create(
    @Body() dto: CreateCredentialRequestDto,
  ): Promise<CredentialResponseDto> {
    const credential = await this.createCredentialUseCase.execute(
      CredentialHttpMapper.toCreateCommand(dto),
    );
    return CredentialHttpMapper.toResponse(credential);
  }

  @Put(CredentialRoutes.byId)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOperation(CredentialSwagger.update)
  @ApiParam({ name: 'id', description: 'Credential id' })
  @ApiResponse({
    status: 200,
    description: 'Credential updated.',
    type: CredentialResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error.',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 403,
    description: 'The Credential belongs to another Identity.',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Credential not found.',
    type: ErrorResponseDto,
  })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateCredentialRequestDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<CredentialResponseDto> {
    const credential = await this.updateCredentialUseCase.execute(
      CredentialHttpMapper.toUpdateCommand(id, dto, user),
    );
    return CredentialHttpMapper.toResponse(credential);
  }

  @Delete(CredentialRoutes.byId)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOperation(CredentialSwagger.delete)
  @ApiParam({ name: 'id', description: 'Credential id' })
  @ApiResponse({ status: 200, description: 'Credential deleted.' })
  @ApiResponse({
    status: 403,
    description: 'The Credential belongs to another Identity.',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Credential not found.',
    type: ErrorResponseDto,
  })
  async remove(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<void> {
    await this.deleteCredentialUseCase.execute(
      new DeleteCredentialCommand(id, user.id, user.role),
    );
  }

  @Get(CredentialRoutes.byId)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOperation(CredentialSwagger.get)
  @ApiParam({ name: 'id', description: 'Credential id' })
  @ApiResponse({
    status: 200,
    description: 'Credential found.',
    type: CredentialResponseDto,
  })
  @ApiResponse({
    status: 403,
    description: 'The Credential belongs to another Identity.',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Credential not found.',
    type: ErrorResponseDto,
  })
  async findOne(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<CredentialResponseDto> {
    const credential = await this.getCredentialUseCase.execute(
      new GetCredentialQuery(id, user.id, user.role),
    );
    return CredentialHttpMapper.toResponse(credential);
  }
}
