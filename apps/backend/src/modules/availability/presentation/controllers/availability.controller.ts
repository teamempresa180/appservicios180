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
import { AvailabilityRoutes } from '../routes/availability.routes';
import { AvailabilitySwagger } from '../swagger/availability.swagger';
import { CreateAvailabilityUseCase } from '../../application/use_cases/create-availability.use-case';
import { UpdateAvailabilityUseCase } from '../../application/use_cases/update-availability.use-case';
import { DeleteAvailabilityUseCase } from '../../application/use_cases/delete-availability.use-case';
import { GetAvailabilityUseCase } from '../../application/use_cases/get-availability.use-case';
import { CreateAvailabilityDto } from '../../application/dto/create-availability.dto';
import { UpdateAvailabilityDto } from '../../application/dto/update-availability.dto';
import { CreateAvailabilityCommand } from '../../application/commands/create-availability.command';
import { UpdateAvailabilityCommand } from '../../application/commands/update-availability.command';
import { DeleteAvailabilityCommand } from '../../application/commands/delete-availability.command';
import { GetAvailabilityQuery } from '../../application/queries/get-availability.query';

/**
 * REST controller for Availability. Only exposes routes and delegates to
 * the corresponding Use Case — no business logic lives here. Use Cases are
 * not implemented yet, so every call currently rejects with "Not implemented yet".
 */
@ApiTags('Availability')
@Controller(AvailabilityRoutes.base)
export class AvailabilityController {
  constructor(
    private readonly createAvailabilityUseCase: CreateAvailabilityUseCase,
    private readonly updateAvailabilityUseCase: UpdateAvailabilityUseCase,
    private readonly deleteAvailabilityUseCase: DeleteAvailabilityUseCase,
    private readonly getAvailabilityUseCase: GetAvailabilityUseCase,
  ) {}

  @Post()
  @ApiOperation(AvailabilitySwagger.create)
  @ApiResponse({ status: 201, description: 'Availability created.' })
  create(@Body() dto: CreateAvailabilityDto) {
    return this.createAvailabilityUseCase.execute(
      new CreateAvailabilityCommand(
        dto.providerId,
        dto.type,
        dto.availableFrom,
        dto.availableTo,
      ),
    );
  }

  @Put(AvailabilityRoutes.byId)
  @ApiOperation(AvailabilitySwagger.update)
  @ApiResponse({ status: 200, description: 'Availability updated.' })
  update(@Param('id') id: string, @Body() dto: UpdateAvailabilityDto) {
    return this.updateAvailabilityUseCase.execute(
      new UpdateAvailabilityCommand(
        id,
        dto.availableFrom,
        dto.availableTo,
        dto.status,
      ),
    );
  }

  @Delete(AvailabilityRoutes.byId)
  @ApiOperation(AvailabilitySwagger.delete)
  @ApiResponse({ status: 200, description: 'Availability deleted.' })
  remove(@Param('id') id: string) {
    return this.deleteAvailabilityUseCase.execute(
      new DeleteAvailabilityCommand(id),
    );
  }

  @Get(AvailabilityRoutes.byId)
  @ApiOperation(AvailabilitySwagger.get)
  @ApiResponse({ status: 200, description: 'Availability found.' })
  findOne(@Param('id') id: string) {
    return this.getAvailabilityUseCase.execute(new GetAvailabilityQuery(id));
  }
}
