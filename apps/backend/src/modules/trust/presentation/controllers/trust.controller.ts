import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ErrorResponseDto } from '../../../../common/swagger/error-response.dto';
import { TrustRoutes } from '../routes/trust.routes';
import { TrustSwagger } from '../swagger/trust.swagger';
import { CreateTrustProfileUseCase } from '../../application/use_cases/create-trust-profile.use-case';
import { UpdateTrustProfileUseCase } from '../../application/use_cases/update-trust-profile.use-case';
import { GetTrustUseCase } from '../../application/use_cases/get-trust.use-case';
import { ListTrustUseCase } from '../../application/use_cases/list-trust.use-case';
import { SearchTrustUseCase } from '../../application/use_cases/search-trust.use-case';
import { GetTrustQuery } from '../../application/queries/get-trust.query';
import { ListTrustQuery } from '../../application/queries/list-trust.query';
import { SearchTrustQuery } from '../../application/queries/search-trust.query';
import { CreateTrustProfileRequestDto } from '../dto/create-trust-profile.request.dto';
import { UpdateTrustProfileRequestDto } from '../dto/update-trust-profile.request.dto';
import { TrustResponseDto } from '../dto/trust.response.dto';
import { TrustListResponseDto } from '../dto/trust-list.response.dto';
import { TrustHttpMapper } from '../dto/trust-http.mapper';

/**
 * REST controller for Trust. Only exposes routes, maps HTTP DTOs to
 * Application commands/queries via `TrustHttpMapper`, and delegates
 * to the corresponding Use Case — no business logic lives here.
 * Domain exceptions thrown by Use Cases (`NotFoundException`,
 * `ValidationException`, `BusinessRuleException` for the "at most one
 * Trust profile per Identity" invariant) are translated to HTTP
 * responses by the global `DomainExceptionFilter`
 * (`common/filters/`), registered in `main.ts` — this controller
 * never catches them itself.
 *
 * No Delete endpoint: there is no `DeleteTrustProfileUseCase` in the
 * Application layer — per Prompt 70's rule, endpoints are only
 * exposed for Use Cases that actually exist.
 *
 * `list`/`search` are declared before the dynamic `findOne(:id)` route
 * so `GET /trust-profiles/search` resolves to `search()` rather than
 * being matched as `findOne({ id: 'search' })`.
 */
@ApiTags('Trust')
@Controller(TrustRoutes.base)
export class TrustController {
  constructor(
    private readonly createTrustProfileUseCase: CreateTrustProfileUseCase,
    private readonly updateTrustProfileUseCase: UpdateTrustProfileUseCase,
    private readonly getTrustUseCase: GetTrustUseCase,
    private readonly listTrustUseCase: ListTrustUseCase,
    private readonly searchTrustUseCase: SearchTrustUseCase,
  ) {}

  @Post()
  @ApiOperation(TrustSwagger.create)
  @ApiResponse({
    status: 201,
    description: 'Trust profile created.',
    type: TrustResponseDto,
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
    description: 'Identity already has a Trust profile.',
    type: ErrorResponseDto,
  })
  async create(
    @Body() dto: CreateTrustProfileRequestDto,
  ): Promise<TrustResponseDto> {
    const trust = await this.createTrustProfileUseCase.execute(
      TrustHttpMapper.toCreateCommand(dto),
    );
    return TrustHttpMapper.toResponse(trust);
  }

  @Put(TrustRoutes.byId)
  @ApiOperation(TrustSwagger.update)
  @ApiParam({ name: 'id', description: 'Trust profile id' })
  @ApiResponse({
    status: 200,
    description: 'Trust profile updated.',
    type: TrustResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error.',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Trust profile not found.',
    type: ErrorResponseDto,
  })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateTrustProfileRequestDto,
  ): Promise<TrustResponseDto> {
    const trust = await this.updateTrustProfileUseCase.execute(
      TrustHttpMapper.toUpdateCommand(id, dto),
    );
    return TrustHttpMapper.toResponse(trust);
  }

  @Get()
  @ApiOperation(TrustSwagger.list)
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'pageSize', required: false, example: 20 })
  @ApiResponse({
    status: 200,
    description: 'Paginated list of Trust profiles.',
    type: TrustListResponseDto,
  })
  async list(
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ): Promise<TrustListResponseDto> {
    const query = new ListTrustQuery(
      page !== undefined ? Number(page) : undefined,
      pageSize !== undefined ? Number(pageSize) : undefined,
    );
    const result = await this.listTrustUseCase.execute(query);
    return TrustHttpMapper.toListResponse(result);
  }

  @Get(TrustRoutes.search)
  @ApiOperation(TrustSwagger.search)
  @ApiQuery({ name: 'term', required: true, example: 'HIGH' })
  @ApiResponse({
    status: 200,
    description: 'Trust profiles matching the search term.',
    type: [TrustResponseDto],
  })
  async search(@Query('term') term: string): Promise<TrustResponseDto[]> {
    const trusts = await this.searchTrustUseCase.execute(
      new SearchTrustQuery(term),
    );
    return trusts.map((trust) => TrustHttpMapper.toResponse(trust));
  }

  @Get(TrustRoutes.byId)
  @ApiOperation(TrustSwagger.get)
  @ApiParam({ name: 'id', description: 'Trust profile id' })
  @ApiResponse({
    status: 200,
    description: 'Trust profile found.',
    type: TrustResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Trust profile not found.',
    type: ErrorResponseDto,
  })
  async findOne(@Param('id') id: string): Promise<TrustResponseDto> {
    const trust = await this.getTrustUseCase.execute(new GetTrustQuery(id));
    return TrustHttpMapper.toResponse(trust);
  }
}
