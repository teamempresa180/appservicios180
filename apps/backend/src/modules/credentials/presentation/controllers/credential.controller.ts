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
import { CredentialRoutes } from '../routes/credential.routes';
import { CredentialSwagger } from '../swagger/credential.swagger';
import { CreateCredentialUseCase } from '../../application/use_cases/create-credential.use-case';
import { UpdateCredentialUseCase } from '../../application/use_cases/update-credential.use-case';
import { DeleteCredentialUseCase } from '../../application/use_cases/delete-credential.use-case';
import { GetCredentialUseCase } from '../../application/use_cases/get-credential.use-case';
import { CreateCredentialDto } from '../../application/dto/create-credential.dto';
import { UpdateCredentialDto } from '../../application/dto/update-credential.dto';
import { CreateCredentialCommand } from '../../application/commands/create-credential.command';
import { UpdateCredentialCommand } from '../../application/commands/update-credential.command';
import { DeleteCredentialCommand } from '../../application/commands/delete-credential.command';
import { GetCredentialQuery } from '../../application/queries/get-credential.query';

/**
 * REST controller for Credential. Only exposes routes and delegates to the
 * corresponding Use Case — no business logic lives here. Use Cases are not
 * implemented yet, so every call currently rejects with "Not implemented yet".
 */
@ApiTags('Credentials')
@Controller(CredentialRoutes.base)
export class CredentialController {
  constructor(
    private readonly createCredentialUseCase: CreateCredentialUseCase,
    private readonly updateCredentialUseCase: UpdateCredentialUseCase,
    private readonly deleteCredentialUseCase: DeleteCredentialUseCase,
    private readonly getCredentialUseCase: GetCredentialUseCase,
  ) {}

  @Post()
  @ApiOperation(CredentialSwagger.create)
  @ApiResponse({ status: 201, description: 'Credential created.' })
  create(@Body() dto: CreateCredentialDto) {
    return this.createCredentialUseCase.execute(
      new CreateCredentialCommand(dto.identityId, dto.type),
    );
  }

  @Put(CredentialRoutes.byId)
  @ApiOperation(CredentialSwagger.update)
  @ApiResponse({ status: 200, description: 'Credential updated.' })
  update(@Param('id') id: string, @Body() dto: UpdateCredentialDto) {
    return this.updateCredentialUseCase.execute(
      new UpdateCredentialCommand(id, dto.status),
    );
  }

  @Delete(CredentialRoutes.byId)
  @ApiOperation(CredentialSwagger.delete)
  @ApiResponse({ status: 200, description: 'Credential deleted.' })
  remove(@Param('id') id: string) {
    return this.deleteCredentialUseCase.execute(
      new DeleteCredentialCommand(id),
    );
  }

  @Get(CredentialRoutes.byId)
  @ApiOperation(CredentialSwagger.get)
  @ApiResponse({ status: 200, description: 'Credential found.' })
  findOne(@Param('id') id: string) {
    return this.getCredentialUseCase.execute(new GetCredentialQuery(id));
  }
}
