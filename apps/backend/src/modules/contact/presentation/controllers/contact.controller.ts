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
import { ContactRoutes } from '../routes/contact.routes';
import { ContactSwagger } from '../swagger/contact.swagger';
import { CreateContactUseCase } from '../../application/use_cases/create-contact.use-case';
import { UpdateContactUseCase } from '../../application/use_cases/update-contact.use-case';
import { DeleteContactUseCase } from '../../application/use_cases/delete-contact.use-case';
import { GetContactUseCase } from '../../application/use_cases/get-contact.use-case';
import { ListContactUseCase } from '../../application/use_cases/list-contact.use-case';
import { SearchContactUseCase } from '../../application/use_cases/search-contact.use-case';
import { DeleteContactCommand } from '../../application/commands/delete-contact.command';
import { GetContactQuery } from '../../application/queries/get-contact.query';
import { ListContactQuery } from '../../application/queries/list-contact.query';
import { SearchContactQuery } from '../../application/queries/search-contact.query';
import { CreateContactRequestDto } from '../dto/create-contact.request.dto';
import { UpdateContactRequestDto } from '../dto/update-contact.request.dto';
import { ContactResponseDto } from '../dto/contact.response.dto';
import { ContactListResponseDto } from '../dto/contact-list.response.dto';
import { ContactHttpMapper } from '../dto/contact-http.mapper';

/**
 * REST controller for Contact. Only exposes routes, maps HTTP DTOs
 * to Application commands/queries via `ContactHttpMapper`, and
 * delegates to the corresponding Use Case — no business logic lives
 * here. Domain exceptions thrown by Use Cases (`NotFoundException`,
 * `ValidationException`) are translated to HTTP responses by the
 * global `DomainExceptionFilter` (`common/filters/`), registered in
 * `main.ts` — this controller never catches them itself.
 *
 * `list`/`search` are declared before the dynamic `findOne(:id)` route
 * so `GET /contacts/search` resolves to `search()` rather than being
 * matched as `findOne({ id: 'search' })`.
 */
@ApiTags('Contact')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller(ContactRoutes.base)
export class ContactController {
  constructor(
    private readonly createContactUseCase: CreateContactUseCase,
    private readonly updateContactUseCase: UpdateContactUseCase,
    private readonly deleteContactUseCase: DeleteContactUseCase,
    private readonly getContactUseCase: GetContactUseCase,
    private readonly listContactUseCase: ListContactUseCase,
    private readonly searchContactUseCase: SearchContactUseCase,
  ) {}

  @Post()
  @ApiOperation(ContactSwagger.create)
  @ApiResponse({
    status: 201,
    description: 'Contact created.',
    type: ContactResponseDto,
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
    @Body() dto: CreateContactRequestDto,
  ): Promise<ContactResponseDto> {
    const contact = await this.createContactUseCase.execute(
      ContactHttpMapper.toCreateCommand(dto),
    );
    return ContactHttpMapper.toResponse(contact);
  }

  @Put(ContactRoutes.byId)
  @ApiOperation(ContactSwagger.update)
  @ApiParam({ name: 'id', description: 'Contact id' })
  @ApiResponse({
    status: 200,
    description: 'Contact updated.',
    type: ContactResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error.',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Contact not found.',
    type: ErrorResponseDto,
  })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateContactRequestDto,
  ): Promise<ContactResponseDto> {
    const contact = await this.updateContactUseCase.execute(
      ContactHttpMapper.toUpdateCommand(id, dto),
    );
    return ContactHttpMapper.toResponse(contact);
  }

  @Delete(ContactRoutes.byId)
  @ApiOperation(ContactSwagger.delete)
  @ApiParam({ name: 'id', description: 'Contact id' })
  @ApiResponse({ status: 200, description: 'Contact deleted.' })
  @ApiResponse({
    status: 404,
    description: 'Contact not found.',
    type: ErrorResponseDto,
  })
  async remove(@Param('id') id: string): Promise<void> {
    await this.deleteContactUseCase.execute(new DeleteContactCommand(id));
  }

  @Get()
  @ApiOperation(ContactSwagger.list)
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'pageSize', required: false, example: 20 })
  @ApiResponse({
    status: 200,
    description: 'Paginated list of Contacts.',
    type: ContactListResponseDto,
  })
  async list(
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ): Promise<ContactListResponseDto> {
    const query = new ListContactQuery(
      page !== undefined ? Number(page) : undefined,
      pageSize !== undefined ? Number(pageSize) : undefined,
    );
    const result = await this.listContactUseCase.execute(query);
    return ContactHttpMapper.toListResponse(result);
  }

  @Get(ContactRoutes.search)
  @ApiOperation(ContactSwagger.search)
  @ApiQuery({ name: 'term', required: true, example: 'jane.doe' })
  @ApiResponse({
    status: 200,
    description: 'Contacts matching the search term.',
    type: [ContactResponseDto],
  })
  async search(@Query('term') term: string): Promise<ContactResponseDto[]> {
    const contacts = await this.searchContactUseCase.execute(
      new SearchContactQuery(term),
    );
    return contacts.map((contact) => ContactHttpMapper.toResponse(contact));
  }

  @Get(ContactRoutes.byId)
  @ApiOperation(ContactSwagger.get)
  @ApiParam({ name: 'id', description: 'Contact id' })
  @ApiResponse({
    status: 200,
    description: 'Contact found.',
    type: ContactResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Contact not found.',
    type: ErrorResponseDto,
  })
  async findOne(@Param('id') id: string): Promise<ContactResponseDto> {
    const contact = await this.getContactUseCase.execute(
      new GetContactQuery(id),
    );
    return ContactHttpMapper.toResponse(contact);
  }
}
