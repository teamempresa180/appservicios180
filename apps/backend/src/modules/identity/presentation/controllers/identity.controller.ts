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
