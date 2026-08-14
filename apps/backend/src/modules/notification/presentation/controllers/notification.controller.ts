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
import { CurrentUser } from '../../../../common/auth/current-user.decorator';
import type { AuthenticatedUser } from '../../../../common/auth/authenticated-user.interface';
import { NotFoundException } from '../../../core/domain/exceptions/not-found.exception';
import { NotificationRoutes } from '../routes/notification.routes';
import { NotificationSwagger } from '../swagger/notification.swagger';
import { CreateNotificationUseCase } from '../../application/use_cases/create-notification.use-case';
import { MarkNotificationAsReadUseCase } from '../../application/use_cases/mark-notification-as-read.use-case';
import { DeleteNotificationUseCase } from '../../application/use_cases/delete-notification.use-case';
import { GetNotificationUseCase } from '../../application/use_cases/get-notification.use-case';
import { ListNotificationUseCase } from '../../application/use_cases/list-notification.use-case';
import { SearchNotificationUseCase } from '../../application/use_cases/search-notification.use-case';
import { MarkNotificationAsReadCommand } from '../../application/commands/mark-notification-as-read.command';
import { DeleteNotificationCommand } from '../../application/commands/delete-notification.command';
import { GetNotificationQuery } from '../../application/queries/get-notification.query';
import { ListNotificationQuery } from '../../application/queries/list-notification.query';
import { SearchNotificationQuery } from '../../application/queries/search-notification.query';
import { CreateNotificationRequestDto } from '../dto/create-notification.request.dto';
import { NotificationResponseDto } from '../dto/notification.response.dto';
import { NotificationListResponseDto } from '../dto/notification-list.response.dto';
import { NotificationHttpMapper } from '../dto/notification-http.mapper';

/**
 * REST controller for Notification. Only exposes routes, maps HTTP
 * DTOs to Application commands/queries via `NotificationHttpMapper`,
 * and delegates to the corresponding Use Case — no business logic
 * lives here. `CreateNotificationUseCase` verifies the referenced
 * Identity exists.
 *
 * `GetNotificationUseCase.execute()` returns `NotificationDto | null`
 * instead of throwing `NotFoundException` (same pattern as
 * `GetChatUseCase`/`GetOrderUseCase`). This controller throws the
 * shared `NotFoundException` itself when the result is `null`, so
 * `DomainExceptionFilter` maps it to 404 exactly as it does
 * everywhere else — not business logic, just translating an existing
 * Application-layer "not found" signal.
 *
 * No Update endpoint: there is no `UpdateNotificationUseCase` in the
 * Application layer — `markAsRead` is the only supported status
 * transition (no archive endpoint despite `NotificationStatus`
 * having an `Archived` member).
 *
 * `search` is declared before the dynamic `findOne(:id)` route so
 * `GET /notifications/search` resolves to `search()` rather than
 * being matched as `findOne({ id: 'search' })`.
 */
@ApiTags('Notification')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller(NotificationRoutes.base)
export class NotificationController {
  constructor(
    private readonly createNotificationUseCase: CreateNotificationUseCase,
    private readonly markNotificationAsReadUseCase: MarkNotificationAsReadUseCase,
    private readonly deleteNotificationUseCase: DeleteNotificationUseCase,
    private readonly getNotificationUseCase: GetNotificationUseCase,
    private readonly listNotificationUseCase: ListNotificationUseCase,
    private readonly searchNotificationUseCase: SearchNotificationUseCase,
  ) {}

  @Post()
  @ApiOperation(NotificationSwagger.create)
  @ApiResponse({
    status: 201,
    description: 'Notification created.',
    type: NotificationResponseDto,
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
    @CurrentUser() caller: AuthenticatedUser,
    @Body() dto: CreateNotificationRequestDto,
  ): Promise<NotificationResponseDto> {
    const notification = await this.createNotificationUseCase.execute(
      NotificationHttpMapper.toCreateCommand(caller, dto),
    );
    return NotificationHttpMapper.toResponse(notification);
  }

  @Put(NotificationRoutes.read)
  @ApiOperation(NotificationSwagger.markAsRead)
  @ApiParam({ name: 'id', description: 'Notification id' })
  @ApiResponse({
    status: 200,
    description: 'Notification marked as read.',
    type: NotificationResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Notification not found.',
    type: ErrorResponseDto,
  })
  async markAsRead(
    @CurrentUser() caller: AuthenticatedUser,
    @Param('id') id: string,
  ): Promise<NotificationResponseDto> {
    const notification = await this.markNotificationAsReadUseCase.execute(
      new MarkNotificationAsReadCommand(caller, id),
    );
    return NotificationHttpMapper.toResponse(notification);
  }

  @Delete(NotificationRoutes.byId)
  @ApiOperation(NotificationSwagger.delete)
  @ApiParam({ name: 'id', description: 'Notification id' })
  @ApiResponse({ status: 200, description: 'Notification deleted.' })
  @ApiResponse({
    status: 404,
    description: 'Notification not found.',
    type: ErrorResponseDto,
  })
  async remove(
    @CurrentUser() caller: AuthenticatedUser,
    @Param('id') id: string,
  ): Promise<void> {
    await this.deleteNotificationUseCase.execute(
      new DeleteNotificationCommand(caller, id),
    );
  }

  @Get()
  @ApiOperation(NotificationSwagger.list)
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'pageSize', required: false, example: 20 })
  @ApiResponse({
    status: 200,
    description: 'Paginated list of Notifications.',
    type: NotificationListResponseDto,
  })
  async list(
    @CurrentUser() caller: AuthenticatedUser,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ): Promise<NotificationListResponseDto> {
    const query = new ListNotificationQuery(
      caller,
      page !== undefined ? Number(page) : undefined,
      pageSize !== undefined ? Number(pageSize) : undefined,
    );
    const result = await this.listNotificationUseCase.execute(query);
    return NotificationHttpMapper.toListResponse(result);
  }

  @Get(NotificationRoutes.search)
  @ApiOperation(NotificationSwagger.search)
  @ApiQuery({ name: 'term', required: true, example: 'order' })
  @ApiResponse({
    status: 200,
    description: 'Notifications matching the search term.',
    type: [NotificationResponseDto],
  })
  async search(
    @CurrentUser() caller: AuthenticatedUser,
    @Query('term') term: string,
  ): Promise<NotificationResponseDto[]> {
    const notifications = await this.searchNotificationUseCase.execute(
      new SearchNotificationQuery(caller, term),
    );
    return notifications.map((notification) =>
      NotificationHttpMapper.toResponse(notification),
    );
  }

  @Get(NotificationRoutes.byId)
  @ApiOperation(NotificationSwagger.get)
  @ApiParam({ name: 'id', description: 'Notification id' })
  @ApiResponse({
    status: 200,
    description: 'Notification found.',
    type: NotificationResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Notification not found.',
    type: ErrorResponseDto,
  })
  async findOne(
    @CurrentUser() caller: AuthenticatedUser,
    @Param('id') id: string,
  ): Promise<NotificationResponseDto> {
    const notification = await this.getNotificationUseCase.execute(
      new GetNotificationQuery(caller, id),
    );
    if (!notification) {
      throw new NotFoundException(`Notification ${id} not found`);
    }
    return NotificationHttpMapper.toResponse(notification);
  }
}
