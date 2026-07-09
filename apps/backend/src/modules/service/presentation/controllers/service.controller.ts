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
import { ServiceRoutes } from '../routes/service.routes';
import { ServiceSwagger } from '../swagger/service.swagger';
import { CreateServiceUseCase } from '../../application/use_cases/create-service.use-case';
import { UpdateServiceUseCase } from '../../application/use_cases/update-service.use-case';
import { DeleteServiceUseCase } from '../../application/use_cases/delete-service.use-case';
import { GetServiceUseCase } from '../../application/use_cases/get-service.use-case';
import { CreateServiceDto } from '../../application/dto/create-service.dto';
import { UpdateServiceDto } from '../../application/dto/update-service.dto';
import { CreateServiceCommand } from '../../application/commands/create-service.command';
import { UpdateServiceCommand } from '../../application/commands/update-service.command';
import { DeleteServiceCommand } from '../../application/commands/delete-service.command';
import { GetServiceQuery } from '../../application/queries/get-service.query';

/**
 * REST controller for Service. Only exposes routes and delegates to the
 * corresponding Use Case — no business logic lives here. Use Cases are not
 * implemented yet, so every call currently rejects with "Not implemented yet".
 */
@ApiTags('Service')
@Controller(ServiceRoutes.base)
export class ServiceController {
  constructor(
    private readonly createServiceUseCase: CreateServiceUseCase,
    private readonly updateServiceUseCase: UpdateServiceUseCase,
    private readonly deleteServiceUseCase: DeleteServiceUseCase,
    private readonly getServiceUseCase: GetServiceUseCase,
  ) {}

  @Post()
  @ApiOperation(ServiceSwagger.create)
  @ApiResponse({ status: 201, description: 'Service created.' })
  create(@Body() dto: CreateServiceDto) {
    return this.createServiceUseCase.execute(
      new CreateServiceCommand(
        dto.providerId,
        dto.categoryId,
        dto.name,
        dto.description,
        dto.basePrice,
        dto.estimatedDuration,
        dto.type,
      ),
    );
  }

  @Put(ServiceRoutes.byId)
  @ApiOperation(ServiceSwagger.update)
  @ApiResponse({ status: 200, description: 'Service updated.' })
  update(@Param('id') id: string, @Body() dto: UpdateServiceDto) {
    return this.updateServiceUseCase.execute(
      new UpdateServiceCommand(
        id,
        dto.basePrice,
        dto.estimatedDuration,
        dto.status,
      ),
    );
  }

  @Delete(ServiceRoutes.byId)
  @ApiOperation(ServiceSwagger.delete)
  @ApiResponse({ status: 200, description: 'Service deleted.' })
  remove(@Param('id') id: string) {
    return this.deleteServiceUseCase.execute(new DeleteServiceCommand(id));
  }

  @Get(ServiceRoutes.byId)
  @ApiOperation(ServiceSwagger.get)
  @ApiResponse({ status: 200, description: 'Service found.' })
  findOne(@Param('id') id: string) {
    return this.getServiceUseCase.execute(new GetServiceQuery(id));
  }
}
