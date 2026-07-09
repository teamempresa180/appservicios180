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
import { ContactRoutes } from '../routes/contact.routes';
import { ContactSwagger } from '../swagger/contact.swagger';
import { CreateContactUseCase } from '../../application/use_cases/create-contact.use-case';
import { UpdateContactUseCase } from '../../application/use_cases/update-contact.use-case';
import { DeleteContactUseCase } from '../../application/use_cases/delete-contact.use-case';
import { GetContactUseCase } from '../../application/use_cases/get-contact.use-case';
import { CreateContactDto } from '../../application/dto/create-contact.dto';
import { UpdateContactDto } from '../../application/dto/update-contact.dto';
import { CreateContactCommand } from '../../application/commands/create-contact.command';
import { UpdateContactCommand } from '../../application/commands/update-contact.command';
import { DeleteContactCommand } from '../../application/commands/delete-contact.command';
import { GetContactQuery } from '../../application/queries/get-contact.query';

/**
 * REST controller for Contact. Only exposes routes and delegates to the
 * corresponding Use Case — no business logic lives here. Use Cases are not
 * implemented yet, so every call currently rejects with "Not implemented yet".
 */
@ApiTags('Contact')
@Controller(ContactRoutes.base)
export class ContactController {
  constructor(
    private readonly createContactUseCase: CreateContactUseCase,
    private readonly updateContactUseCase: UpdateContactUseCase,
    private readonly deleteContactUseCase: DeleteContactUseCase,
    private readonly getContactUseCase: GetContactUseCase,
  ) {}

  @Post()
  @ApiOperation(ContactSwagger.create)
  @ApiResponse({ status: 201, description: 'Contact created.' })
  create(@Body() dto: CreateContactDto) {
    return this.createContactUseCase.execute(
      new CreateContactCommand(dto.identityId, dto.type, dto.value),
    );
  }

  @Put(ContactRoutes.byId)
  @ApiOperation(ContactSwagger.update)
  @ApiResponse({ status: 200, description: 'Contact updated.' })
  update(@Param('id') id: string, @Body() dto: UpdateContactDto) {
    return this.updateContactUseCase.execute(
      new UpdateContactCommand(id, dto.value, dto.status),
    );
  }

  @Delete(ContactRoutes.byId)
  @ApiOperation(ContactSwagger.delete)
  @ApiResponse({ status: 200, description: 'Contact deleted.' })
  remove(@Param('id') id: string) {
    return this.deleteContactUseCase.execute(new DeleteContactCommand(id));
  }

  @Get(ContactRoutes.byId)
  @ApiOperation(ContactSwagger.get)
  @ApiResponse({ status: 200, description: 'Contact found.' })
  findOne(@Param('id') id: string) {
    return this.getContactUseCase.execute(new GetContactQuery(id));
  }
}
