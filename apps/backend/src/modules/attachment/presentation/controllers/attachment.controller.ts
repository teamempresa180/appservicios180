import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ErrorResponseDto } from '../../../../common/swagger/error-response.dto';
import { NotFoundException } from '../../../core/domain/exceptions/not-found.exception';
import { AttachmentRoutes } from '../routes/attachment.routes';
import { AttachmentSwagger } from '../swagger/attachment.swagger';
import { CreateAttachmentUseCase } from '../../application/use_cases/create-attachment.use-case';
import { DeleteAttachmentUseCase } from '../../application/use_cases/delete-attachment.use-case';
import { GetAttachmentUseCase } from '../../application/use_cases/get-attachment.use-case';
import { ListAttachmentUseCase } from '../../application/use_cases/list-attachment.use-case';
import { SearchAttachmentUseCase } from '../../application/use_cases/search-attachment.use-case';
import { DeleteAttachmentCommand } from '../../application/commands/delete-attachment.command';
import { GetAttachmentQuery } from '../../application/queries/get-attachment.query';
import { ListAttachmentQuery } from '../../application/queries/list-attachment.query';
import { SearchAttachmentQuery } from '../../application/queries/search-attachment.query';
import { CreateAttachmentRequestDto } from '../dto/create-attachment.request.dto';
import { AttachmentResponseDto } from '../dto/attachment.response.dto';
import { AttachmentListResponseDto } from '../dto/attachment-list.response.dto';
import { AttachmentHttpMapper } from '../dto/attachment-http.mapper';

/**
 * REST controller for Attachment. Only exposes routes, maps HTTP
 * DTOs to Application commands/queries via `AttachmentHttpMapper`,
 * and delegates to the corresponding Use Case — no business logic
 * lives here. `CreateAttachmentUseCase` verifies the referenced
 * Message exists.
 *
 * `GetAttachmentUseCase.execute()` returns `AttachmentDto | null`
 * instead of throwing `NotFoundException` (same pattern as
 * `GetMessageUseCase`/`GetChatUseCase`). This controller throws the
 * shared `NotFoundException` itself when the result is `null`, so
 * `DomainExceptionFilter` maps it to 404 exactly as it does
 * everywhere else — not business logic, just translating an existing
 * Application-layer "not found" signal.
 *
 * No Update endpoint and no status-transition endpoint: there is no
 * corresponding Use Case in the Application layer despite
 * `AttachmentStatus` having `Available`/`Failed`/`Removed` members —
 * only Create/Delete/Get/List/Search exist.
 *
 * `search` is declared before the dynamic `findOne(:id)` route so
 * `GET /attachments/search` resolves to `search()` rather than being
 * matched as `findOne({ id: 'search' })`.
 */
@ApiTags('Attachment')
@Controller(AttachmentRoutes.base)
export class AttachmentController {
  constructor(
    private readonly createAttachmentUseCase: CreateAttachmentUseCase,
    private readonly deleteAttachmentUseCase: DeleteAttachmentUseCase,
    private readonly getAttachmentUseCase: GetAttachmentUseCase,
    private readonly listAttachmentUseCase: ListAttachmentUseCase,
    private readonly searchAttachmentUseCase: SearchAttachmentUseCase,
  ) {}

  @Post()
  @ApiOperation(AttachmentSwagger.create)
  @ApiResponse({
    status: 201,
    description: 'Attachment created.',
    type: AttachmentResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error.',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Message not found.',
    type: ErrorResponseDto,
  })
  async create(
    @Body() dto: CreateAttachmentRequestDto,
  ): Promise<AttachmentResponseDto> {
    const attachment = await this.createAttachmentUseCase.execute(
      AttachmentHttpMapper.toCreateCommand(dto),
    );
    return AttachmentHttpMapper.toResponse(attachment);
  }

  @Delete(AttachmentRoutes.byId)
  @ApiOperation(AttachmentSwagger.delete)
  @ApiParam({ name: 'id', description: 'Attachment id' })
  @ApiResponse({ status: 200, description: 'Attachment deleted.' })
  @ApiResponse({
    status: 404,
    description: 'Attachment not found.',
    type: ErrorResponseDto,
  })
  async remove(@Param('id') id: string): Promise<void> {
    await this.deleteAttachmentUseCase.execute(new DeleteAttachmentCommand(id));
  }

  @Get()
  @ApiOperation(AttachmentSwagger.list)
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'pageSize', required: false, example: 20 })
  @ApiResponse({
    status: 200,
    description: 'Paginated list of Attachments.',
    type: AttachmentListResponseDto,
  })
  async list(
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ): Promise<AttachmentListResponseDto> {
    const query = new ListAttachmentQuery(
      page !== undefined ? Number(page) : undefined,
      pageSize !== undefined ? Number(pageSize) : undefined,
    );
    const result = await this.listAttachmentUseCase.execute(query);
    return AttachmentHttpMapper.toListResponse(result);
  }

  @Get(AttachmentRoutes.search)
  @ApiOperation(AttachmentSwagger.search)
  @ApiQuery({ name: 'term', required: true, example: 'photo' })
  @ApiResponse({
    status: 200,
    description: 'Attachments matching the search term.',
    type: [AttachmentResponseDto],
  })
  async search(@Query('term') term: string): Promise<AttachmentResponseDto[]> {
    const attachments = await this.searchAttachmentUseCase.execute(
      new SearchAttachmentQuery(term),
    );
    return attachments.map((attachment) =>
      AttachmentHttpMapper.toResponse(attachment),
    );
  }

  @Get(AttachmentRoutes.byId)
  @ApiOperation(AttachmentSwagger.get)
  @ApiParam({ name: 'id', description: 'Attachment id' })
  @ApiResponse({
    status: 200,
    description: 'Attachment found.',
    type: AttachmentResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Attachment not found.',
    type: ErrorResponseDto,
  })
  async findOne(@Param('id') id: string): Promise<AttachmentResponseDto> {
    const attachment = await this.getAttachmentUseCase.execute(
      new GetAttachmentQuery(id),
    );
    if (!attachment) {
      throw new NotFoundException(`Attachment ${id} not found`);
    }
    return AttachmentHttpMapper.toResponse(attachment);
  }
}
