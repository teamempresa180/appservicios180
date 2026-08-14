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
import { RolesGuard } from '../../../../common/auth/roles.guard';
import { Roles } from '../../../../common/auth/roles.decorator';
import { Role } from '../../../../common/auth/role.enum';
import { CurrentUser } from '../../../../common/auth/current-user.decorator';
import type { AuthenticatedUser } from '../../../../common/auth/authenticated-user.interface';
import { AvailabilityRoutes } from '../routes/availability.routes';
import { AvailabilitySwagger } from '../swagger/availability.swagger';
import { CreateAvailabilityUseCase } from '../../application/use_cases/create-availability.use-case';
import { UpdateAvailabilityUseCase } from '../../application/use_cases/update-availability.use-case';
import { DeleteAvailabilityUseCase } from '../../application/use_cases/delete-availability.use-case';
import { GetAvailabilityUseCase } from '../../application/use_cases/get-availability.use-case';
import { ListAvailabilityUseCase } from '../../application/use_cases/list-availability.use-case';
import { SearchAvailabilityUseCase } from '../../application/use_cases/search-availability.use-case';
import { DeleteAvailabilityCommand } from '../../application/commands/delete-availability.command';
import { GetAvailabilityQuery } from '../../application/queries/get-availability.query';
import { ListAvailabilityQuery } from '../../application/queries/list-availability.query';
import { SearchAvailabilityQuery } from '../../application/queries/search-availability.query';
import { CreateAvailabilityRequestDto } from '../dto/create-availability.request.dto';
import { UpdateAvailabilityRequestDto } from '../dto/update-availability.request.dto';
import { AvailabilityResponseDto } from '../dto/availability.response.dto';
import { AvailabilityListResponseDto } from '../dto/availability-list.response.dto';
import { AvailabilityHttpMapper } from '../dto/availability-http.mapper';

/**
 * REST controller for Availability. Only exposes routes, maps HTTP
 * DTOs to Application commands/queries via `AvailabilityHttpMapper`,
 * and delegates to the corresponding Use Case — no business logic
 * lives here. Domain exceptions thrown by Use Cases
 * (`NotFoundException`, `ValidationException`) are translated to HTTP
 * responses by the global `DomainExceptionFilter`
 * (`common/filters/`), registered in `main.ts` — this controller
 * never catches them itself. `CreateAvailabilityUseCase` verifies the
 * referenced Provider exists via a single `findById` call — no N+1.
 *
 * `list`/`search` are declared before the dynamic `findOne(:id)` route
 * so `GET /availabilities/search` resolves to `search()` rather than
 * being matched as `findOne({ id: 'search' })`.
 */
@ApiTags('Availability')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
@Controller(AvailabilityRoutes.base)
export class AvailabilityController {
  constructor(
    private readonly createAvailabilityUseCase: CreateAvailabilityUseCase,
    private readonly updateAvailabilityUseCase: UpdateAvailabilityUseCase,
    private readonly deleteAvailabilityUseCase: DeleteAvailabilityUseCase,
    private readonly getAvailabilityUseCase: GetAvailabilityUseCase,
    private readonly listAvailabilityUseCase: ListAvailabilityUseCase,
    private readonly searchAvailabilityUseCase: SearchAvailabilityUseCase,
  ) {}

  @Post()
  @ApiOperation(AvailabilitySwagger.create)
  @ApiResponse({
    status: 201,
    description: 'Availability created.',
    type: AvailabilityResponseDto,
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
  @Roles(Role.Provider, Role.Admin)
  async create(
    @Body() dto: CreateAvailabilityRequestDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<AvailabilityResponseDto> {
    const availability = await this.createAvailabilityUseCase.execute(
      AvailabilityHttpMapper.toCreateCommand(dto),
      user,
    );
    return AvailabilityHttpMapper.toResponse(availability);
  }

  @Put(AvailabilityRoutes.byId)
  @ApiOperation(AvailabilitySwagger.update)
  @ApiParam({ name: 'id', description: 'Availability id' })
  @ApiResponse({
    status: 200,
    description: 'Availability updated.',
    type: AvailabilityResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error.',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Availability not found.',
    type: ErrorResponseDto,
  })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateAvailabilityRequestDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<AvailabilityResponseDto> {
    const availability = await this.updateAvailabilityUseCase.execute(
      AvailabilityHttpMapper.toUpdateCommand(id, dto),
      user,
    );
    return AvailabilityHttpMapper.toResponse(availability);
  }

  @Delete(AvailabilityRoutes.byId)
  @ApiOperation(AvailabilitySwagger.delete)
  @ApiParam({ name: 'id', description: 'Availability id' })
  @ApiResponse({ status: 200, description: 'Availability deleted.' })
  @ApiResponse({
    status: 404,
    description: 'Availability not found.',
    type: ErrorResponseDto,
  })
  async remove(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<void> {
    await this.deleteAvailabilityUseCase.execute(
      new DeleteAvailabilityCommand(id),
      user,
    );
  }

  @Get()
  @ApiOperation(AvailabilitySwagger.list)
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'pageSize', required: false, example: 20 })
  @ApiResponse({
    status: 200,
    description: 'Paginated list of Availabilities.',
    type: AvailabilityListResponseDto,
  })
  async list(
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ): Promise<AvailabilityListResponseDto> {
    const query = new ListAvailabilityQuery(
      page !== undefined ? Number(page) : undefined,
      pageSize !== undefined ? Number(pageSize) : undefined,
    );
    const result = await this.listAvailabilityUseCase.execute(query);
    return AvailabilityHttpMapper.toListResponse(result);
  }

  @Get(AvailabilityRoutes.search)
  @ApiOperation(AvailabilitySwagger.search)
  @ApiQuery({ name: 'term', required: true, example: 'FULL_TIME' })
  @ApiResponse({
    status: 200,
    description: 'Availabilities matching the search term.',
    type: [AvailabilityResponseDto],
  })
  async search(
    @Query('term') term: string,
  ): Promise<AvailabilityResponseDto[]> {
    const availabilities = await this.searchAvailabilityUseCase.execute(
      new SearchAvailabilityQuery(term),
    );
    return availabilities.map((availability) =>
      AvailabilityHttpMapper.toResponse(availability),
    );
  }

  @Get(AvailabilityRoutes.byId)
  @ApiOperation(AvailabilitySwagger.get)
  @ApiParam({ name: 'id', description: 'Availability id' })
  @ApiResponse({
    status: 200,
    description: 'Availability found.',
    type: AvailabilityResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Availability not found.',
    type: ErrorResponseDto,
  })
  async findOne(@Param('id') id: string): Promise<AvailabilityResponseDto> {
    const availability = await this.getAvailabilityUseCase.execute(
      new GetAvailabilityQuery(id),
    );
    return AvailabilityHttpMapper.toResponse(availability);
  }
}
