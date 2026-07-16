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
import { ErrorResponseDto } from '../../../../common/swagger/error-response.dto';
import { JwtAuthGuard } from '../../../../common/auth/jwt-auth.guard';
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
 * `POST /identities`, before any token exists.
 * `update`/`delete`/`findOne` all require an existing session.
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
  async create(
    @Body() dto: CreateCredentialRequestDto,
  ): Promise<CredentialResponseDto> {
    const credential = await this.createCredentialUseCase.execute(
      CredentialHttpMapper.toCreateCommand(dto),
    );
    return CredentialHttpMapper.toResponse(credential);
  }

  @Put(CredentialRoutes.byId)
  @UseGuards(JwtAuthGuard)
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
    status: 404,
    description: 'Credential not found.',
    type: ErrorResponseDto,
  })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateCredentialRequestDto,
  ): Promise<CredentialResponseDto> {
    const credential = await this.updateCredentialUseCase.execute(
      CredentialHttpMapper.toUpdateCommand(id, dto),
    );
    return CredentialHttpMapper.toResponse(credential);
  }

  @Delete(CredentialRoutes.byId)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation(CredentialSwagger.delete)
  @ApiParam({ name: 'id', description: 'Credential id' })
  @ApiResponse({ status: 200, description: 'Credential deleted.' })
  @ApiResponse({
    status: 404,
    description: 'Credential not found.',
    type: ErrorResponseDto,
  })
  async remove(@Param('id') id: string): Promise<void> {
    await this.deleteCredentialUseCase.execute(new DeleteCredentialCommand(id));
  }

  @Get(CredentialRoutes.byId)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation(CredentialSwagger.get)
  @ApiParam({ name: 'id', description: 'Credential id' })
  @ApiResponse({
    status: 200,
    description: 'Credential found.',
    type: CredentialResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Credential not found.',
    type: ErrorResponseDto,
  })
  async findOne(@Param('id') id: string): Promise<CredentialResponseDto> {
    const credential = await this.getCredentialUseCase.execute(
      new GetCredentialQuery(id),
    );
    return CredentialHttpMapper.toResponse(credential);
  }
}
