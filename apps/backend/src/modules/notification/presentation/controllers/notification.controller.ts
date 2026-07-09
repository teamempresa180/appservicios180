import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { NotificationRoutes } from '../routes/notification.routes';
import { NotificationSwagger } from '../swagger/notification.swagger';
import { CreateNotificationUseCase } from '../../application/use_cases/create-notification.use-case';
import { MarkNotificationAsReadUseCase } from '../../application/use_cases/mark-notification-as-read.use-case';
import { DeleteNotificationUseCase } from '../../application/use_cases/delete-notification.use-case';
import { GetNotificationUseCase } from '../../application/use_cases/get-notification.use-case';
import { CreateNotificationDto } from '../../application/dto/create-notification.dto';
import { CreateNotificationCommand } from '../../application/commands/create-notification.command';
import { MarkNotificationAsReadCommand } from '../../application/commands/mark-notification-as-read.command';
import { DeleteNotificationCommand } from '../../application/commands/delete-notification.command';
import { GetNotificationQuery } from '../../application/queries/get-notification.query';

/**
 * REST controller for Notification. Only exposes routes and delegates to
 * the corresponding Use Case — no business logic lives here. Use Cases are
 * not implemented yet, so every call currently rejects with "Not implemented yet".
 */
@ApiTags('Notification')
@Controller(NotificationRoutes.base)
export class NotificationController {
  constructor(
    private readonly createNotificationUseCase: CreateNotificationUseCase,
    private readonly markNotificationAsReadUseCase: MarkNotificationAsReadUseCase,
    private readonly deleteNotificationUseCase: DeleteNotificationUseCase,
    private readonly getNotificationUseCase: GetNotificationUseCase,
  ) {}

  @Post()
  @ApiOperation(NotificationSwagger.create)
  @ApiResponse({ status: 201, description: 'Notification created.' })
  create(@Body() dto: CreateNotificationDto) {
    return this.createNotificationUseCase.execute(
      new CreateNotificationCommand(
        dto.identityId,
        dto.title,
        dto.body,
        dto.type,
      ),
    );
  }

  @Put(NotificationRoutes.read)
  @ApiOperation(NotificationSwagger.markAsRead)
  @ApiResponse({ status: 200, description: 'Notification marked as read.' })
  markAsRead(@Param('id') id: string) {
    return this.markNotificationAsReadUseCase.execute(
      new MarkNotificationAsReadCommand(id),
    );
  }

  @Delete(NotificationRoutes.byId)
  @ApiOperation(NotificationSwagger.delete)
  @ApiResponse({ status: 200, description: 'Notification deleted.' })
  remove(@Param('id') id: string) {
    return this.deleteNotificationUseCase.execute(
      new DeleteNotificationCommand(id),
    );
  }

  @Get(NotificationRoutes.byId)
  @ApiOperation(NotificationSwagger.get)
  @ApiResponse({ status: 200, description: 'Notification found.' })
  findOne(@Param('id') id: string) {
    return this.getNotificationUseCase.execute(new GetNotificationQuery(id));
  }
}
