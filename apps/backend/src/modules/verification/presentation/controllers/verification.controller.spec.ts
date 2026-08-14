import { Role } from '../../../../common/auth/role.enum';
import type { AuthenticatedUser } from '../../../../common/auth/authenticated-user.interface';
import { VerificationController } from './verification.controller';
import { CreateVerificationUseCase } from '../../application/use_cases/create-verification.use-case';
import { UpdateVerificationUseCase } from '../../application/use_cases/update-verification.use-case';
import { GetVerificationUseCase } from '../../application/use_cases/get-verification.use-case';
import { ListVerificationUseCase } from '../../application/use_cases/list-verification.use-case';
import { SearchVerificationUseCase } from '../../application/use_cases/search-verification.use-case';
import { UploadVerificationDocumentUseCase } from '../../application/use_cases/upload-verification-document.use-case';
import { CreateVerificationCommand } from '../../application/commands/create-verification.command';
import { UpdateVerificationCommand } from '../../application/commands/update-verification.command';
import { UploadVerificationDocumentCommand } from '../../application/commands/upload-verification-document.command';
import { GetVerificationQuery } from '../../application/queries/get-verification.query';
import { ListVerificationQuery } from '../../application/queries/list-verification.query';
import { SearchVerificationQuery } from '../../application/queries/search-verification.query';
import { VerificationDto } from '../../application/dto/verification.dto';
import { VerificationType } from '../../domain/value-objects/verification-type.value-object';
import { VerificationStatus } from '../../domain/value-objects/verification-status.value-object';
import { CreateVerificationRequestDto } from '../dto/create-verification.request.dto';
import { UpdateVerificationRequestDto } from '../dto/update-verification.request.dto';
import { ValidationException } from '../../../core/domain/exceptions/validation.exception';
import { NotFoundException } from '../../../core/domain/exceptions/not-found.exception';
import { LocalVerificationDocumentStorageService } from '../../infrastructure/storage/local-verification-document-storage.service';

describe('VerificationController', () => {
  const caller: AuthenticatedUser = { id: 'identity-1', role: Role.Customer };

  let controller: VerificationController;
  let createUseCase: { execute: jest.Mock };
  let updateUseCase: { execute: jest.Mock };
  let getUseCase: { execute: jest.Mock };
  let listUseCase: { execute: jest.Mock };
  let searchUseCase: { execute: jest.Mock };
  let uploadDocumentUseCase: { execute: jest.Mock };
  let documentStorage: { save: jest.Mock };

  const verificationDto: VerificationDto = {
    id: 'id-1',
    identityId: 'identity-1',
    type: VerificationType.Document,
    status: VerificationStatus.Pending,
    verifiedAt: null,
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
    updatedAt: new Date('2026-01-01T00:00:00.000Z'),
    documentPath: null,
  };

  const verificationWithDocumentDto: VerificationDto = {
    ...verificationDto,
    documentPath: 'uploads/verifications/id-1/record.pdf',
  };

  beforeEach(() => {
    createUseCase = { execute: jest.fn().mockResolvedValue(verificationDto) };
    updateUseCase = { execute: jest.fn().mockResolvedValue(verificationDto) };
    getUseCase = { execute: jest.fn().mockResolvedValue(verificationDto) };
    listUseCase = {
      execute: jest.fn().mockResolvedValue({
        items: [verificationDto],
        total: 1,
        page: 1,
        pageSize: 20,
      }),
    };
    searchUseCase = { execute: jest.fn().mockResolvedValue([verificationDto]) };
    uploadDocumentUseCase = {
      execute: jest.fn().mockResolvedValue(verificationWithDocumentDto),
    };
    documentStorage = {
      save: jest
        .fn()
        .mockResolvedValue('uploads/verifications/id-1/record.pdf'),
    };

    controller = new VerificationController(
      createUseCase as unknown as CreateVerificationUseCase,
      updateUseCase as unknown as UpdateVerificationUseCase,
      getUseCase as unknown as GetVerificationUseCase,
      listUseCase as unknown as ListVerificationUseCase,
      searchUseCase as unknown as SearchVerificationUseCase,
      uploadDocumentUseCase as unknown as UploadVerificationDocumentUseCase,
      documentStorage as unknown as LocalVerificationDocumentStorageService,
    );
  });

  it('create() maps the request DTO to a command and the Application DTO to a response DTO', async () => {
    const dto: CreateVerificationRequestDto = {
      identityId: 'identity-1',
      type: VerificationType.Document,
    };

    const response = await controller.create(dto, caller);

    expect(createUseCase.execute).toHaveBeenCalledWith(
      new CreateVerificationCommand(
        'identity-1',
        VerificationType.Document,
        caller,
      ),
    );
    expect(response.id).toBe('id-1');
    expect(response.verifiedAt).toBeNull();
  });

  it('update() maps id + request DTO to a command', async () => {
    const dto: UpdateVerificationRequestDto = {
      status: VerificationStatus.Approved,
    };

    const response = await controller.update('id-1', dto, caller);

    expect(updateUseCase.execute).toHaveBeenCalledWith(
      new UpdateVerificationCommand(
        'id-1',
        VerificationStatus.Approved,
        caller,
      ),
    );
    expect(response.id).toBe('id-1');
  });

  it('list() maps page/pageSize query params to a query and wraps the paginated result', async () => {
    const response = await controller.list(caller, '2', '10');

    expect(listUseCase.execute).toHaveBeenCalledWith(
      new ListVerificationQuery(caller, 2, 10),
    );
    expect(response.items).toHaveLength(1);
    expect(response.total).toBe(1);
  });

  it('search() maps the term query param and the Application DTOs to response DTOs', async () => {
    const response = await controller.search('DOCUMENT', caller);

    expect(searchUseCase.execute).toHaveBeenCalledWith(
      new SearchVerificationQuery('DOCUMENT', caller),
    );
    expect(response).toHaveLength(1);
    expect(response[0].type).toBe(VerificationType.Document);
  });

  it('findOne() maps the Application DTO returned by GetVerificationUseCase', async () => {
    const response = await controller.findOne('id-1', caller);

    expect(getUseCase.execute).toHaveBeenCalledWith(
      new GetVerificationQuery('id-1', caller),
    );
    expect(response.type).toBe(VerificationType.Document);
  });

  describe('uploadDocument()', () => {
    const file = {
      originalname: 'record.pdf',
      mimetype: 'application/pdf',
      buffer: Buffer.from('pdf-bytes'),
    };

    it('confirms the Verification exists, stores the file, then persists the resulting path', async () => {
      const response = await controller.uploadDocument('id-1', file, caller);

      expect(getUseCase.execute).toHaveBeenCalledWith(
        new GetVerificationQuery('id-1', caller),
      );
      expect(documentStorage.save).toHaveBeenCalledWith('id-1', file);
      expect(uploadDocumentUseCase.execute).toHaveBeenCalledWith(
        new UploadVerificationDocumentCommand(
          'id-1',
          'uploads/verifications/id-1/record.pdf',
          caller,
        ),
      );
      expect(response.documentPath).toBe(
        'uploads/verifications/id-1/record.pdf',
      );
    });

    it('throws ValidationException when no file is provided', async () => {
      await expect(
        controller.uploadDocument('id-1', undefined, caller),
      ).rejects.toThrow(ValidationException);
      expect(documentStorage.save).not.toHaveBeenCalled();
      expect(uploadDocumentUseCase.execute).not.toHaveBeenCalled();
    });

    it('propagates NotFoundException from GetVerificationUseCase without touching storage', async () => {
      getUseCase.execute.mockRejectedValueOnce(
        new NotFoundException('Verification unknown-id not found'),
      );

      await expect(
        controller.uploadDocument('unknown-id', file, caller),
      ).rejects.toThrow(NotFoundException);
      expect(documentStorage.save).not.toHaveBeenCalled();
    });
  });
});

