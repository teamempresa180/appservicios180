import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ErrorResponseDto } from '../../../../common/swagger/error-response.dto';
import { ProviderRoutes } from '../routes/provider.routes';
import { ProviderSwagger } from '../swagger/provider.swagger';
import { CreateProviderUseCase } from '../../application/use_cases/create-provider.use-case';
import { UpdateProviderUseCase } from '../../application/use_cases/update-provider.use-case';
import { DeleteProviderUseCase } from '../../application/use_cases/delete-provider.use-case';
import { GetProviderUseCase } from '../../application/use_cases/get-provider.use-case';
import { ListProviderUseCase } from '../../application/use_cases/list-provider.use-case';
import { SearchProviderUseCase } from '../../application/use_cases/search-provider.use-case';
import { DeleteProviderCommand } from '../../application/commands/delete-provider.command';
import { GetProviderQuery } from '../../application/queries/get-provider.query';
import { ListProviderQuery } from '../../application/queries/list-provider.query';
import { SearchProviderQuery } from '../../application/queries/search-provider.query';
import { CreateProviderRequestDto } from '../dto/create-provider.request.dto';
import { UpdateProviderRequestDto } from '../dto/update-provider.request.dto';
import { ProviderResponseDto } from '../dto/provider.response.dto';
import { ProviderListResponseDto } from '../dto/provider-list.response.dto';
import { ProviderHttpMapper } from '../dto/provider-http.mapper';

/**
 * REST controller for Provider. Only exposes routes, maps HTTP DTOs
 * to Application commands/queries via `ProviderHttpMapper`, and
 * delegates to the corresponding Use Case — no business logic lives
 * here. Domain exceptions thrown by Use Cases (`NotFoundException`,
 * `ValidationException`, `BusinessRuleException` for the "at most one
 * Provider per Identity" invariant) are translated to HTTP responses
 * by the global `DomainExceptionFilter` (`common/filters/`),
 * registered in `main.ts` — this controller never catches them
 * itself. `CreateProviderUseCase` verifies both the referenced
 * Identity and the referenced Profile exist (two sequential
 * `findById` calls, not a loop — no N+1 risk).
 *
 * `list`/`search` are declared before the dynamic `findOne(:id)` route
 * so `GET /providers/search` resolves to `search()` rather than being
 * matched as `findOne({ id: 'search' })`.
 */
@ApiTags('Provider')
@Controller(ProviderRoutes.base)
export class ProviderController {
  constructor(
    private readonly createProviderUseCase: CreateProviderUseCase,
    private readonly updateProviderUseCase: UpdateProviderUseCase,
    private readonly deleteProviderUseCase: DeleteProviderUseCase,
    private readonly getProviderUseCase: GetProviderUseCase,
    private readonly listProviderUseCase: ListProviderUseCase,
    private readonly searchProviderUseCase: SearchProviderUseCase,
  ) {}

  @Post()
  @ApiOperation(ProviderSwagger.create)
  @ApiResponse({
    status: 201,
    description: 'Provider created.',
    type: ProviderResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error.',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Identity or Profile not found.',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 422,
    description: 'Identity already has a Provider record.',
    type: ErrorResponseDto,
  })
  async create(
    @Body() dto: CreateProviderRequestDto,
  ): Promise<ProviderResponseDto> {
    const provider = await this.createProviderUseCase.execute(
      ProviderHttpMapper.toCreateCommand(dto),
    );
    return ProviderHttpMapper.toResponse(provider);
  }

  @Put(ProviderRoutes.byId)
  @ApiOperation(ProviderSwagger.update)
  @ApiParam({ name: 'id', description: 'Provider id' })
  @ApiResponse({
    status: 200,
    description: 'Provider updated.',
    type: ProviderResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error.',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Provider not found.',
    type: ErrorResponseDto,
  })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateProviderRequestDto,
  ): Promise<ProviderResponseDto> {
    const provider = await this.updateProviderUseCase.execute(
      ProviderHttpMapper.toUpdateCommand(id, dto),
    );
    return ProviderHttpMapper.toResponse(provider);
  }

  @Delete(ProviderRoutes.byId)
  @ApiOperation(ProviderSwagger.delete)
  @ApiParam({ name: 'id', description: 'Provider id' })
  @ApiResponse({ status: 200, description: 'Provider deleted.' })
  @ApiResponse({
    status: 404,
    description: 'Provider not found.',
    type: ErrorResponseDto,
  })
  async remove(@Param('id') id: string): Promise<void> {
    await this.deleteProviderUseCase.execute(new DeleteProviderCommand(id));
  }

  @Get()
  @ApiOperation(ProviderSwagger.list)
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'pageSize', required: false, example: 20 })
  @ApiResponse({
    status: 200,
    description: 'Paginated list of Providers.',
    type: ProviderListResponseDto,
  })
  async list(
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ): Promise<ProviderListResponseDto> {
    const query = new ListProviderQuery(
      page !== undefined ? Number(page) : undefined,
      pageSize !== undefined ? Number(pageSize) : undefined,
    );
    const result = await this.listProviderUseCase.execute(query);
    return ProviderHttpMapper.toListResponse(result);
  }

  @Get(ProviderRoutes.search)
  @ApiOperation(ProviderSwagger.search)
  @ApiQuery({ name: 'term', required: true, example: 'plumber' })
  @ApiResponse({
    status: 200,
    description: 'Providers matching the search term.',
    type: [ProviderResponseDto],
  })
  async search(@Query('term') term: string): Promise<ProviderResponseDto[]> {
    const providers = await this.searchProviderUseCase.execute(
      new SearchProviderQuery(term),
    );
    return providers.map((provider) => ProviderHttpMapper.toResponse(provider));
  }

  @Get(ProviderRoutes.byId)
  @ApiOperation(ProviderSwagger.get)
  @ApiParam({ name: 'id', description: 'Provider id' })
  @ApiResponse({
    status: 200,
    description: 'Provider found.',
    type: ProviderResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Provider not found.',
    type: ErrorResponseDto,
  })
  async findOne(@Param('id') id: string): Promise<ProviderResponseDto> {
    const provider = await this.getProviderUseCase.execute(
      new GetProviderQuery(id),
    );
    return ProviderHttpMapper.toResponse(provider);
  }
}
