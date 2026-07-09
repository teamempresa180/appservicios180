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
import { ScheduleRoutes } from '../routes/schedule.routes';
import { ScheduleSwagger } from '../swagger/schedule.swagger';
import { CreateScheduleUseCase } from '../../application/use_cases/create-schedule.use-case';
import { UpdateScheduleUseCase } from '../../application/use_cases/update-schedule.use-case';
import { DeleteScheduleUseCase } from '../../application/use_cases/delete-schedule.use-case';
import { GetScheduleUseCase } from '../../application/use_cases/get-schedule.use-case';
import { CreateScheduleDto } from '../../application/dto/create-schedule.dto';
import { UpdateScheduleDto } from '../../application/dto/update-schedule.dto';
import { CreateScheduleCommand } from '../../application/commands/create-schedule.command';
import { UpdateScheduleCommand } from '../../application/commands/update-schedule.command';
import { DeleteScheduleCommand } from '../../application/commands/delete-schedule.command';
import { GetScheduleQuery } from '../../application/queries/get-schedule.query';

/**
 * REST controller for Schedule. Only exposes routes and delegates to the
 * corresponding Use Case — no business logic lives here. Use Cases are not
 * implemented yet, so every call currently rejects with "Not implemented yet".
 */
@ApiTags('Schedule')
@Controller(ScheduleRoutes.base)
export class ScheduleController {
  constructor(
    private readonly createScheduleUseCase: CreateScheduleUseCase,
    private readonly updateScheduleUseCase: UpdateScheduleUseCase,
    private readonly deleteScheduleUseCase: DeleteScheduleUseCase,
    private readonly getScheduleUseCase: GetScheduleUseCase,
  ) {}

  @Post()
  @ApiOperation(ScheduleSwagger.create)
  @ApiResponse({ status: 201, description: 'Schedule block created.' })
  create(@Body() dto: CreateScheduleDto) {
    return this.createScheduleUseCase.execute(
      new CreateScheduleCommand(
        dto.providerId,
        dto.startDateTime,
        dto.endDateTime,
        dto.type,
      ),
    );
  }

  @Put(ScheduleRoutes.byId)
  @ApiOperation(ScheduleSwagger.update)
  @ApiResponse({ status: 200, description: 'Schedule block updated.' })
  update(@Param('id') id: string, @Body() dto: UpdateScheduleDto) {
    return this.updateScheduleUseCase.execute(
      new UpdateScheduleCommand(
        id,
        dto.startDateTime,
        dto.endDateTime,
        dto.status,
      ),
    );
  }

  @Delete(ScheduleRoutes.byId)
  @ApiOperation(ScheduleSwagger.delete)
  @ApiResponse({ status: 200, description: 'Schedule block deleted.' })
  remove(@Param('id') id: string) {
    return this.deleteScheduleUseCase.execute(new DeleteScheduleCommand(id));
  }

  @Get(ScheduleRoutes.byId)
  @ApiOperation(ScheduleSwagger.get)
  @ApiResponse({ status: 200, description: 'Schedule block found.' })
  findOne(@Param('id') id: string) {
    return this.getScheduleUseCase.execute(new GetScheduleQuery(id));
  }
}
