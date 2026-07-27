import { NotFoundException } from '../../../core/domain/exceptions/not-found.exception';
import { Verification } from '../../domain/entities/verification.entity';
import { VerificationRepository } from '../../domain/interfaces/verification-repository.interface';
import { VerificationId } from '../../domain/value-objects/verification-id.value-object';
import { UploadVerificationDocumentCommand } from '../commands/upload-verification-document.command';
import { VerificationDto } from '../dto/verification.dto';
import { VerificationMapper } from '../mappers/verification.mapper';
import { VerificationValidator } from '../validators/verification.validator';

/**
 * Attaches an already-stored file's relative path to an existing
 * Verification's `documentPath`. Same single-field-mutation shape as
 * `UpdateVerificationUseCase`: validates the command, confirms the
 * Verification exists, rebuilds it with only `documentPath` (and
 * `updatedAt`) changed, and persists via `save`. The file itself is
 * already on disk by the time this use case runs (see
 * `LocalVerificationDocumentStorageService`, invoked from the
 * controller before this use case) — this only ever deals with the
 * path string, never file bytes, keeping the Application layer free of
 * any filesystem/multipart concerns.
 */
export class UploadVerificationDocumentUseCase {
  constructor(
    private readonly verificationRepository: VerificationRepository,
  ) {}

  async execute(
    command: UploadVerificationDocumentCommand,
  ): Promise<VerificationDto> {
    VerificationValidator.validateUploadDocument(command);

    const id = VerificationId.fromString(command.id);
    const existing = await this.verificationRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(`Verification ${command.id} not found`);
    }

    const updated = new Verification(existing.id, {
      identityId: existing.identityId,
      type: existing.type,
      status: existing.status,
      verifiedAt: existing.verifiedAt,
      createdAt: existing.createdAt,
      updatedAt: new Date(),
      documentPath: command.documentPath,
    });

    await this.verificationRepository.save(updated);
    return VerificationMapper.toDto(updated);
  }
}
