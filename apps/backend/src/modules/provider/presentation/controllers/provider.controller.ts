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
import { ProviderRoutes } from '../routes/provider.routes';
import { ProviderSwagger } from '../swagger/provider.swagger';
import { CreateProviderUseCase } from '../../application/use_cases/create-provider.use-case';
import { UpdateProviderUseCase } from '../../application/use_cases/update-provider.use-case';
import { DeleteProviderUseCase } from '../../application/use_cases/delete-provider.use-case';
import { GetProviderUseCase } from '../../application/use_cases/get-provider.use-case';
import { CreateProviderDto } from '../../application/dto/create-provider.dto';
import { UpdateProviderDto } from '../../application/dto/update-provider.dto';
import { CreateProviderCommand } from '../../application/commands/create-provider.command';
import { UpdateProviderCommand } from '../../application/commands/update-provider.command';
import { DeleteProviderCommand } from '../../application/commands/delete-provider.command';
import { GetProviderQuery } from '../../application/queries/get-provider.query';

/**
 * REST controller for Provider. Only exposes routes and delegates to the
 * corresponding Use Case — no business logic lives here. Use Cases are not
 * implemented yet, so every call currently rejects with "Not implemented yet".
 */
@ApiTags('Provider')
@Controller(ProviderRoutes.base)
export class ProviderController {
  constructor(
    private readonly createProviderUseCase: CreateProviderUseCase,
    private readonly updateProviderUseCase: UpdateProviderUseCase,
    private readonly deleteProviderUseCase: DeleteProviderUseCase,
    private readonly getProviderUseCase: GetProviderUseCase,
  ) {}

  @Post()
  @ApiOperation(ProviderSwagger.create)
  @ApiResponse({ status: 201, description: 'Provider created.' })
  create(@Body() dto: CreateProviderDto) {
    return this.createProviderUseCase.execute(
      new CreateProviderCommand(
        dto.identityId,
        dto.providerProfileId,
        dto.type,
        dto.experience,
        dto.biography,
        dto.yearsOfExperience,
      ),
    );
  }

  @Put(ProviderRoutes.byId)
  @ApiOperation(ProviderSwagger.update)
  @ApiResponse({ status: 200, description: 'Provider updated.' })
  update(@Param('id') id: string, @Body() dto: UpdateProviderDto) {
    return this.updateProviderUseCase.execute(
      new UpdateProviderCommand(id, dto.biography, dto.experience, dto.status),
    );
  }

  @Delete(ProviderRoutes.byId)
  @ApiOperation(ProviderSwagger.delete)
  @ApiResponse({ status: 200, description: 'Provider deleted.' })
  remove(@Param('id') id: string) {
    return this.deleteProviderUseCase.execute(new DeleteProviderCommand(id));
  }

  @Get(ProviderRoutes.byId)
  @ApiOperation(ProviderSwagger.get)
  @ApiResponse({ status: 200, description: 'Provider found.' })
  findOne(@Param('id') id: string) {
    return this.getProviderUseCase.execute(new GetProviderQuery(id));
  }
}
