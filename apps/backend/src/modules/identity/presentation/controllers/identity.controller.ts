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
import { IdentityRoutes } from '../routes/identity.routes';
import { IdentitySwagger } from '../swagger/identity.swagger';
import { CreateIdentityUseCase } from '../../application/use_cases/create-identity.use-case';
import { UpdateIdentityUseCase } from '../../application/use_cases/update-identity.use-case';
import { DeleteIdentityUseCase } from '../../application/use_cases/delete-identity.use-case';
import { GetIdentityUseCase } from '../../application/use_cases/get-identity.use-case';
import { CreateIdentityDto } from '../../application/dto/create-identity.dto';
import { UpdateIdentityDto } from '../../application/dto/update-identity.dto';
import { CreateIdentityCommand } from '../../application/commands/create-identity.command';
import { UpdateIdentityCommand } from '../../application/commands/update-identity.command';
import { DeleteIdentityCommand } from '../../application/commands/delete-identity.command';
import { GetIdentityQuery } from '../../application/queries/get-identity.query';

/**
 * REST controller for Identity. Only exposes routes and delegates to the
 * corresponding Use Case — no business logic lives here. Use Cases are not
 * implemented yet, so every call currently rejects with "Not implemented yet".
 */
@ApiTags('Identity')
@Controller(IdentityRoutes.base)
export class IdentityController {
  constructor(
    private readonly createIdentityUseCase: CreateIdentityUseCase,
    private readonly updateIdentityUseCase: UpdateIdentityUseCase,
    private readonly deleteIdentityUseCase: DeleteIdentityUseCase,
    private readonly getIdentityUseCase: GetIdentityUseCase,
  ) {}

  @Post()
  @ApiOperation(IdentitySwagger.create)
  @ApiResponse({ status: 201, description: 'Identity created.' })
  create(@Body() dto: CreateIdentityDto) {
    return this.createIdentityUseCase.execute(
      new CreateIdentityCommand(
        dto.fullName,
        dto.documentType,
        dto.documentNumber,
        dto.birthDate,
      ),
    );
  }

  @Put(IdentityRoutes.byId)
  @ApiOperation(IdentitySwagger.update)
  @ApiResponse({ status: 200, description: 'Identity updated.' })
  update(@Param('id') id: string, @Body() dto: UpdateIdentityDto) {
    return this.updateIdentityUseCase.execute(
      new UpdateIdentityCommand(id, dto.fullName, dto.status),
    );
  }

  @Delete(IdentityRoutes.byId)
  @ApiOperation(IdentitySwagger.delete)
  @ApiResponse({ status: 200, description: 'Identity deleted.' })
  remove(@Param('id') id: string) {
    return this.deleteIdentityUseCase.execute(new DeleteIdentityCommand(id));
  }

  @Get(IdentityRoutes.byId)
  @ApiOperation(IdentitySwagger.get)
  @ApiResponse({ status: 200, description: 'Identity found.' })
  findOne(@Param('id') id: string) {
    return this.getIdentityUseCase.execute(new GetIdentityQuery(id));
  }
}
