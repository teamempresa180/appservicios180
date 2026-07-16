import {
  Body,
  Controller,
  UseGuards,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ErrorResponseDto } from '../../../../common/swagger/error-response.dto';
import { JwtAuthGuard } from '../../../../common/auth/jwt-auth.guard';
import { ServiceRoutes } from '../routes/service.routes';
import { ServiceSwagger } from '../swagger/service.swagger';
import { CreateServiceUseCase } from '../../application/use_cases/create-service.use-case';
import { UpdateServiceUseCase } from '../../application/use_cases/update-service.use-case';
import { DeleteServiceUseCase } from '../../application/use_cases/delete-service.use-case';
import { GetServiceUseCase } from '../../application/use_cases/get-service.use-case';
import { ListServiceUseCase } from '../../application/use_cases/list-service.use-case';
import { SearchServiceUseCase } from '../../application/use_cases/search-service.use-case';
import { DeleteServiceCommand } from '../../application/commands/delete-service.command';
import { GetServiceQuery } from '../../application/queries/get-service.query';
import { ListServiceQuery } from '../../application/queries/list-service.query';
import { SearchServiceQuery } from '../../application/queries/search-service.query';
import { CreateServiceRequestDto } from '../dto/create-service.request.dto';
import { UpdateServiceRequestDto } from '../dto/update-service.request.dto';
import { ServiceResponseDto } from '../dto/service.response.dto';
import { ServiceListResponseDto } from '../dto/service-list.response.dto';
import { ServiceHttpMapper } from '../dto/service-http.mapper';

/**
 * REST controller for Service. Only exposes routes, maps HTTP DTOs to
 * Application commands/queries via `ServiceHttpMapper`, and delegates
 * to the corresponding Use Case — no business logic lives here.
 * Domain exceptions thrown by Use Cases (`NotFoundException`,
 * `ValidationException`) are translated to HTTP responses by the
 * global `DomainExceptionFilter` (`common/filters/`), registered in
 * `main.ts` — this controller never catches them itself.
 * `CreateServiceUseCase` verifies both the referenced Category and
 * the referenced Provider exist (two sequential `findById` calls, not
 * a loop — no N+1 risk) before creating a Service.
 *
 * `list`/`search` are declared before the dynamic `findOne(:id)` route
 * so `GET /services/search` resolves to `search()` rather than being
 * matched as `findOne({ id: 'search' })`.
 */
@ApiTags('Service')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller(ServiceRoutes.base)
export class ServiceController {
  constructor(
    private readonly createServiceUseCase: CreateServiceUseCase,
    private readonly updateServiceUseCase: UpdateServiceUseCase,
    private readonly deleteServiceUseCase: DeleteServiceUseCase,
    private readonly getServiceUseCase: GetServiceUseCase,
    private readonly listServiceUseCase: ListServiceUseCase,
    private readonly searchServiceUseCase: SearchServiceUseCase,
  ) {}

  @Post()
  @ApiOperation(ServiceSwagger.create)
  @ApiResponse({
    status: 201,
    description: 'Service created.',
    type: ServiceResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error.',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Category or Provider not found.',
    type: ErrorResponseDto,
  })
  async create(
    @Body() dto: CreateServiceRequestDto,
  ): Promise<ServiceResponseDto> {
    const service = await this.createServiceUseCase.execute(
      ServiceHttpMapper.toCreateCommand(dto),
    );
    return ServiceHttpMapper.toResponse(service);
  }

  @Put(ServiceRoutes.byId)
  @ApiOperation(ServiceSwagger.update)
  @ApiParam({ name: 'id', description: 'Service id' })
  @ApiResponse({
    status: 200,
    description: 'Service updated.',
    type: ServiceResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error.',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Service not found.',
    type: ErrorResponseDto,
  })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateServiceRequestDto,
  ): Promise<ServiceResponseDto> {
    const service = await this.updateServiceUseCase.execute(
      ServiceHttpMapper.toUpdateCommand(id, dto),
    );
    return ServiceHttpMapper.toResponse(service);
  }

  @Delete(ServiceRoutes.byId)
  @ApiOperation(ServiceSwagger.delete)
  @ApiParam({ name: 'id', description: 'Service id' })
  @ApiResponse({ status: 200, description: 'Service deleted.' })
  @ApiResponse({
    status: 404,
    description: 'Service not found.',
    type: ErrorResponseDto,
  })
  async remove(@Param('id') id: string): Promise<void> {
    await this.deleteServiceUseCase.execute(new DeleteServiceCommand(id));
  }

  @Get()
  @ApiOperation(ServiceSwagger.list)
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'pageSize', required: false, example: 20 })
  @ApiResponse({
    status: 200,
    description: 'Paginated list of Services.',
    type: ServiceListResponseDto,
  })
  async list(
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ): Promise<ServiceListResponseDto> {
    const query = new ListServiceQuery(
      page !== undefined ? Number(page) : undefined,
      pageSize !== undefined ? Number(pageSize) : undefined,
    );
    const result = await this.listServiceUseCase.execute(query);
    return ServiceHttpMapper.toListResponse(result);
  }

  @Get(ServiceRoutes.search)
  @ApiOperation(ServiceSwagger.search)
  @ApiQuery({ name: 'term', required: true, example: 'Pipe repair' })
  @ApiResponse({
    status: 200,
    description: 'Services matching the search term.',
    type: [ServiceResponseDto],
  })
  async search(@Query('term') term: string): Promise<ServiceResponseDto[]> {
    const services = await this.searchServiceUseCase.execute(
      new SearchServiceQuery(term),
    );
    return services.map((service) => ServiceHttpMapper.toResponse(service));
  }

  @Get(ServiceRoutes.byId)
  @ApiOperation(ServiceSwagger.get)
  @ApiParam({ name: 'id', description: 'Service id' })
  @ApiResponse({
    status: 200,
    description: 'Service found.',
    type: ServiceResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Service not found.',
    type: ErrorResponseDto,
  })
  async findOne(@Param('id') id: string): Promise<ServiceResponseDto> {
    const service = await this.getServiceUseCase.execute(
      new GetServiceQuery(id),
    );
    return ServiceHttpMapper.toResponse(service);
  }
}
