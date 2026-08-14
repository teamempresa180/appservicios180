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
import { ScheduleRoutes } from '../routes/schedule.routes';
import { ScheduleSwagger } from '../swagger/schedule.swagger';
import { CreateScheduleUseCase } from '../../application/use_cases/create-schedule.use-case';
import { UpdateScheduleUseCase } from '../../application/use_cases/update-schedule.use-case';
import { DeleteScheduleUseCase } from '../../application/use_cases/delete-schedule.use-case';
import { GetScheduleUseCase } from '../../application/use_cases/get-schedule.use-case';
import { ListScheduleUseCase } from '../../application/use_cases/list-schedule.use-case';
import { SearchScheduleUseCase } from '../../application/use_cases/search-schedule.use-case';
import { DeleteScheduleCommand } from '../../application/commands/delete-schedule.command';
import { GetScheduleQuery } from '../../application/queries/get-schedule.query';
import { ListScheduleQuery } from '../../application/queries/list-schedule.query';
import { SearchScheduleQuery } from '../../application/queries/search-schedule.query';
import { CreateScheduleRequestDto } from '../dto/create-schedule.request.dto';
import { UpdateScheduleRequestDto } from '../dto/update-schedule.request.dto';
import { ScheduleResponseDto } from '../dto/schedule.response.dto';
import { ScheduleListResponseDto } from '../dto/schedule-list.response.dto';
import { ScheduleHttpMapper } from '../dto/schedule-http.mapper';

/**
 * REST controller for Schedule. Only exposes routes, maps HTTP DTOs
 * to Application commands/queries via `ScheduleHttpMapper`, and
 * delegates to the corresponding Use Case — no business logic lives
 * here. Domain exceptions thrown by Use Cases (`NotFoundException`,
 * `ValidationException`) are translated to HTTP responses by the
 * global `DomainExceptionFilter` (`common/filters/`), registered in
 * `main.ts` — this controller never catches them itself.
 * `CreateScheduleUseCase` verifies the referenced Provider exists via
 * a single `findById` call — no N+1.
 *
 * `list`/`search` are declared before the dynamic `findOne(:id)` route
 * so `GET /schedules/search` resolves to `search()` rather than being
 * matched as `findOne({ id: 'search' })`.
 */
@ApiTags('Schedule')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
@Controller(ScheduleRoutes.base)
export class ScheduleController {
  constructor(
    private readonly createScheduleUseCase: CreateScheduleUseCase,
    private readonly updateScheduleUseCase: UpdateScheduleUseCase,
    private readonly deleteScheduleUseCase: DeleteScheduleUseCase,
    private readonly getScheduleUseCase: GetScheduleUseCase,
    private readonly listScheduleUseCase: ListScheduleUseCase,
    private readonly searchScheduleUseCase: SearchScheduleUseCase,
  ) {}

  @Post()
  @ApiOperation(ScheduleSwagger.create)
  @ApiResponse({
    status: 201,
    description: 'Schedule block created.',
    type: ScheduleResponseDto,
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
    @Body() dto: CreateScheduleRequestDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<ScheduleResponseDto> {
    const schedule = await this.createScheduleUseCase.execute(
      ScheduleHttpMapper.toCreateCommand(dto),
      user,
    );
    return ScheduleHttpMapper.toResponse(schedule);
  }

  @Put(ScheduleRoutes.byId)
  @ApiOperation(ScheduleSwagger.update)
  @ApiParam({ name: 'id', description: 'Schedule id' })
  @ApiResponse({
    status: 200,
    description: 'Schedule block updated.',
    type: ScheduleResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error.',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Schedule block not found.',
    type: ErrorResponseDto,
  })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateScheduleRequestDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<ScheduleResponseDto> {
    const schedule = await this.updateScheduleUseCase.execute(
      ScheduleHttpMapper.toUpdateCommand(id, dto),
      user,
    );
    return ScheduleHttpMapper.toResponse(schedule);
  }

  @Delete(ScheduleRoutes.byId)
  @ApiOperation(ScheduleSwagger.delete)
  @ApiParam({ name: 'id', description: 'Schedule id' })
  @ApiResponse({ status: 200, description: 'Schedule block deleted.' })
  @ApiResponse({
    status: 404,
    description: 'Schedule block not found.',
    type: ErrorResponseDto,
  })
  async remove(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<void> {
    await this.deleteScheduleUseCase.execute(
      new DeleteScheduleCommand(id),
      user,
    );
  }

  @Get()
  @ApiOperation(ScheduleSwagger.list)
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'pageSize', required: false, example: 20 })
  @ApiResponse({
    status: 200,
    description: 'Paginated list of Schedule blocks.',
    type: ScheduleListResponseDto,
  })
  async list(
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ): Promise<ScheduleListResponseDto> {
    const query = new ListScheduleQuery(
      page !== undefined ? Number(page) : undefined,
      pageSize !== undefined ? Number(pageSize) : undefined,
    );
    const result = await this.listScheduleUseCase.execute(query);
    return ScheduleHttpMapper.toListResponse(result);
  }

  @Get(ScheduleRoutes.search)
  @ApiOperation(ScheduleSwagger.search)
  @ApiQuery({ name: 'term', required: true, example: 'REGULAR' })
  @ApiResponse({
    status: 200,
    description: 'Schedule blocks matching the search term.',
    type: [ScheduleResponseDto],
  })
  async search(@Query('term') term: string): Promise<ScheduleResponseDto[]> {
    const schedules = await this.searchScheduleUseCase.execute(
      new SearchScheduleQuery(term),
    );
    return schedules.map((schedule) => ScheduleHttpMapper.toResponse(schedule));
  }

  @Get(ScheduleRoutes.byId)
  @ApiOperation(ScheduleSwagger.get)
  @ApiParam({ name: 'id', description: 'Schedule id' })
  @ApiResponse({
    status: 200,
    description: 'Schedule block found.',
    type: ScheduleResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Schedule block not found.',
    type: ErrorResponseDto,
  })
  async findOne(@Param('id') id: string): Promise<ScheduleResponseDto> {
    const schedule = await this.getScheduleUseCase.execute(
      new GetScheduleQuery(id),
    );
    return ScheduleHttpMapper.toResponse(schedule);
  }
}
