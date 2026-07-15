import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ErrorResponseDto } from '../../../../common/swagger/error-response.dto';
import { AuditRoutes } from '../routes/audit.routes';
import { AuditSwagger } from '../swagger/audit.swagger';
import { CreateAuditRecordUseCase } from '../../application/use_cases/create-audit-record.use-case';
import { GetAuditUseCase } from '../../application/use_cases/get-audit.use-case';
import { ListAuditUseCase } from '../../application/use_cases/list-audit.use-case';
import { SearchAuditUseCase } from '../../application/use_cases/search-audit.use-case';
import { GetAuditQuery } from '../../application/queries/get-audit.query';
import { ListAuditQuery } from '../../application/queries/list-audit.query';
import { SearchAuditQuery } from '../../application/queries/search-audit.query';
import { CreateAuditRecordRequestDto } from '../dto/create-audit-record.request.dto';
import { AuditRecordResponseDto } from '../dto/audit-record.response.dto';
import { AuditRecordListResponseDto } from '../dto/audit-record-list.response.dto';
import { AuditHttpMapper } from '../dto/audit-http.mapper';

/**
 * REST controller for Audit. Only exposes routes, maps HTTP DTOs to
 * Application commands/queries via `AuditHttpMapper`, and delegates
 * to the corresponding Use Case — no business logic lives here.
 * Domain exceptions thrown by Use Cases (`NotFoundException`,
 * `ValidationException`) are translated to HTTP responses by the
 * global `DomainExceptionFilter` (`common/filters/`), registered in
 * `main.ts` — this controller never catches them itself.
 *
 * No Update/Delete endpoint: there is no `UpdateAuditRecordUseCase`/
 * `DeleteAuditRecordUseCase` in the Application layer — audit records
 * are immutable by design, and per Prompt 70's rule, endpoints are
 * only exposed for Use Cases that actually exist.
 *
 * `list`/`search` are declared before the dynamic `findOne(:id)` route
 * so `GET /audit-records/search` resolves to `search()` rather than
 * being matched as `findOne({ id: 'search' })`.
 */
@ApiTags('Audit')
@Controller(AuditRoutes.base)
export class AuditController {
  constructor(
    private readonly createAuditRecordUseCase: CreateAuditRecordUseCase,
    private readonly getAuditUseCase: GetAuditUseCase,
    private readonly listAuditUseCase: ListAuditUseCase,
    private readonly searchAuditUseCase: SearchAuditUseCase,
  ) {}

  @Post()
  @ApiOperation(AuditSwagger.create)
  @ApiResponse({
    status: 201,
    description: 'Audit record created.',
    type: AuditRecordResponseDto,
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
    @Body() dto: CreateAuditRecordRequestDto,
  ): Promise<AuditRecordResponseDto> {
    const audit = await this.createAuditRecordUseCase.execute(
      AuditHttpMapper.toCreateCommand(dto),
    );
    return AuditHttpMapper.toResponse(audit);
  }

  @Get()
  @ApiOperation(AuditSwagger.list)
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'pageSize', required: false, example: 20 })
  @ApiResponse({
    status: 200,
    description: 'Paginated list of Audit records.',
    type: AuditRecordListResponseDto,
  })
  async list(
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ): Promise<AuditRecordListResponseDto> {
    const query = new ListAuditQuery(
      page !== undefined ? Number(page) : undefined,
      pageSize !== undefined ? Number(pageSize) : undefined,
    );
    const result = await this.listAuditUseCase.execute(query);
    return AuditHttpMapper.toListResponse(result);
  }

  @Get(AuditRoutes.search)
  @ApiOperation(AuditSwagger.search)
  @ApiQuery({ name: 'term', required: true, example: 'logged in' })
  @ApiResponse({
    status: 200,
    description: 'Audit records matching the search term.',
    type: [AuditRecordResponseDto],
  })
  async search(@Query('term') term: string): Promise<AuditRecordResponseDto[]> {
    const audits = await this.searchAuditUseCase.execute(
      new SearchAuditQuery(term),
    );
    return audits.map((audit) => AuditHttpMapper.toResponse(audit));
  }

  @Get(AuditRoutes.byId)
  @ApiOperation(AuditSwagger.get)
  @ApiParam({ name: 'id', description: 'Audit record id' })
  @ApiResponse({
    status: 200,
    description: 'Audit record found.',
    type: AuditRecordResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Audit record not found.',
    type: ErrorResponseDto,
  })
  async findOne(@Param('id') id: string): Promise<AuditRecordResponseDto> {
    const audit = await this.getAuditUseCase.execute(new GetAuditQuery(id));
    return AuditHttpMapper.toResponse(audit);
  }
}
