import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AttachmentRoutes } from '../routes/attachment.routes';
import { AttachmentSwagger } from '../swagger/attachment.swagger';
import { CreateAttachmentUseCase } from '../../application/use_cases/create-attachment.use-case';
import { DeleteAttachmentUseCase } from '../../application/use_cases/delete-attachment.use-case';
import { GetAttachmentUseCase } from '../../application/use_cases/get-attachment.use-case';
import { CreateAttachmentDto } from '../../application/dto/create-attachment.dto';
import { CreateAttachmentCommand } from '../../application/commands/create-attachment.command';
import { DeleteAttachmentCommand } from '../../application/commands/delete-attachment.command';
import { GetAttachmentQuery } from '../../application/queries/get-attachment.query';

/**
 * REST controller for Attachment. Only exposes routes and delegates to the
 * corresponding Use Case — no business logic lives here. Use Cases are not
 * implemented yet, so every call currently rejects with "Not implemented yet".
 */
@ApiTags('Attachment')
@Controller(AttachmentRoutes.base)
export class AttachmentController {
  constructor(
    private readonly createAttachmentUseCase: CreateAttachmentUseCase,
    private readonly deleteAttachmentUseCase: DeleteAttachmentUseCase,
    private readonly getAttachmentUseCase: GetAttachmentUseCase,
  ) {}

  @Post()
  @ApiOperation(AttachmentSwagger.create)
  @ApiResponse({ status: 201, description: 'Attachment created.' })
  create(@Body() dto: CreateAttachmentDto) {
    return this.createAttachmentUseCase.execute(
      new CreateAttachmentCommand(
        dto.messageId,
        dto.fileName,
        dto.mimeType,
        dto.fileSize,
        dto.type,
      ),
    );
  }

  @Delete(AttachmentRoutes.byId)
  @ApiOperation(AttachmentSwagger.delete)
  @ApiResponse({ status: 200, description: 'Attachment deleted.' })
  remove(@Param('id') id: string) {
    return this.deleteAttachmentUseCase.execute(
      new DeleteAttachmentCommand(id),
    );
  }

  @Get(AttachmentRoutes.byId)
  @ApiOperation(AttachmentSwagger.get)
  @ApiResponse({ status: 200, description: 'Attachment found.' })
  findOne(@Param('id') id: string) {
    return this.getAttachmentUseCase.execute(new GetAttachmentQuery(id));
  }
}
