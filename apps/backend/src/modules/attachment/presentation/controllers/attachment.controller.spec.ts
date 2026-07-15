import { AttachmentController } from './attachment.controller';
import { CreateAttachmentUseCase } from '../../application/use_cases/create-attachment.use-case';
import { DeleteAttachmentUseCase } from '../../application/use_cases/delete-attachment.use-case';
import { GetAttachmentUseCase } from '../../application/use_cases/get-attachment.use-case';
import { ListAttachmentUseCase } from '../../application/use_cases/list-attachment.use-case';
import { SearchAttachmentUseCase } from '../../application/use_cases/search-attachment.use-case';
import { CreateAttachmentCommand } from '../../application/commands/create-attachment.command';
import { DeleteAttachmentCommand } from '../../application/commands/delete-attachment.command';
import { GetAttachmentQuery } from '../../application/queries/get-attachment.query';
import { ListAttachmentQuery } from '../../application/queries/list-attachment.query';
import { SearchAttachmentQuery } from '../../application/queries/search-attachment.query';
import { AttachmentDto } from '../../application/dto/attachment.dto';
import { AttachmentStatus } from '../../domain/value-objects/attachment-status.value-object';
import { AttachmentType } from '../../domain/value-objects/attachment-type.value-object';
import { CreateAttachmentRequestDto } from '../dto/create-attachment.request.dto';
import { NotFoundException } from '../../../core/domain/exceptions/not-found.exception';

describe('AttachmentController', () => {
  let controller: AttachmentController;
  let createUseCase: { execute: jest.Mock };
  let deleteUseCase: { execute: jest.Mock };
  let getUseCase: { execute: jest.Mock };
  let listUseCase: { execute: jest.Mock };
  let searchUseCase: { execute: jest.Mock };

  const attachmentDto: AttachmentDto = {
    id: 'id-1',
    messageId: 'message-1',
    fileName: 'leak-photo.jpg',
    mimeType: 'image/jpeg',
    fileSize: 204800,
    type: AttachmentType.Image,
    status: AttachmentStatus.Pending,
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
  };

  beforeEach(() => {
    createUseCase = { execute: jest.fn().mockResolvedValue(attachmentDto) };
    deleteUseCase = { execute: jest.fn().mockResolvedValue(undefined) };
    getUseCase = { execute: jest.fn().mockResolvedValue(attachmentDto) };
    listUseCase = {
      execute: jest.fn().mockResolvedValue({
        items: [attachmentDto],
        total: 1,
        page: 1,
        pageSize: 20,
      }),
    };
    searchUseCase = { execute: jest.fn().mockResolvedValue([attachmentDto]) };

    controller = new AttachmentController(
      createUseCase as unknown as CreateAttachmentUseCase,
      deleteUseCase as unknown as DeleteAttachmentUseCase,
      getUseCase as unknown as GetAttachmentUseCase,
      listUseCase as unknown as ListAttachmentUseCase,
      searchUseCase as unknown as SearchAttachmentUseCase,
    );
  });

  it('create() maps the request DTO to a command and the Application DTO to a response DTO', async () => {
    const dto: CreateAttachmentRequestDto = {
      messageId: 'message-1',
      fileName: 'leak-photo.jpg',
      mimeType: 'image/jpeg',
      fileSize: 204800,
      type: AttachmentType.Image,
    };

    const response = await controller.create(dto);

    expect(createUseCase.execute).toHaveBeenCalledWith(
      new CreateAttachmentCommand(
        'message-1',
        'leak-photo.jpg',
        'image/jpeg',
        204800,
        AttachmentType.Image,
      ),
    );
    expect(response.id).toBe('id-1');
  });

  it('remove() delegates to DeleteAttachmentUseCase with the id', async () => {
    await controller.remove('id-1');

    expect(deleteUseCase.execute).toHaveBeenCalledWith(
      new DeleteAttachmentCommand('id-1'),
    );
  });

  it('list() maps page/pageSize query params to a query and wraps the paginated result', async () => {
    const response = await controller.list('2', '10');

    expect(listUseCase.execute).toHaveBeenCalledWith(
      new ListAttachmentQuery(2, 10),
    );
    expect(response.items).toHaveLength(1);
    expect(response.total).toBe(1);
  });

  it('search() maps the term query param and the Application DTOs to response DTOs', async () => {
    const response = await controller.search('photo');

    expect(searchUseCase.execute).toHaveBeenCalledWith(
      new SearchAttachmentQuery('photo'),
    );
    expect(response).toHaveLength(1);
    expect(response[0].fileName).toBe('leak-photo.jpg');
  });

  it('findOne() maps the Application DTO returned by GetAttachmentUseCase', async () => {
    const response = await controller.findOne('id-1');

    expect(getUseCase.execute).toHaveBeenCalledWith(
      new GetAttachmentQuery('id-1'),
    );
    expect(response.fileName).toBe('leak-photo.jpg');
  });

  it('findOne() throws NotFoundException when GetAttachmentUseCase returns null', async () => {
    getUseCase.execute.mockResolvedValue(null);

    await expect(controller.findOne('unknown-id')).rejects.toThrow(
      NotFoundException,
    );
  });
});
