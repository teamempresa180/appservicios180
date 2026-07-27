import { NotFoundException } from '../../../core/domain/exceptions/not-found.exception';
import { Verification } from '../../domain/entities/verification.entity';
import { VerificationRepository } from '../../domain/interfaces/verification-repository.interface';
import { VerificationId } from '../../domain/value-objects/verification-id.value-object';
import { UpdateVerificationCommand } from '../commands/update-verification.command';
import { VerificationDto } from '../dto/verification.dto';
import { VerificationMapper } from '../mappers/verification.mapper';
import { VerificationValidator } from '../validators/verification.validator';

/**
 * Updates the mutable fields of an existing Verification (`status`) —
 * `type` is not offered by `UpdateVerificationCommand` (immutable
 * after creation, same pattern as `Contact.type`). `verifiedAt` is
 * documented as settable on `UpdateVerificationDto` but
 * `UpdateVerificationCommand` doesn't expose it, so it stays
 * untouched, same criterion already applied to `Profile.avatarUrl`/
 * `Address.city` — not derived, since deriving it from `status` would
 * be inventing behavior the pure-data-holder `Verification` entity
 * doesn't document.
 */
export class UpdateVerificationUseCase {
  constructor(
    private readonly verificationRepository: VerificationRepository,
  ) {}

  async execute(command: UpdateVerificationCommand): Promise<VerificationDto> {
    VerificationValidator.validateUpdate(command);

    const id = VerificationId.fromString(command.id);
    const existing = await this.verificationRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(`Verification ${command.id} not found`);
    }

    const updated = new Verification(existing.id, {
      identityId: existing.identityId,
      type: existing.type,
      status: command.status ?? existing.status,
      verifiedAt: existing.verifiedAt,
      createdAt: existing.createdAt,
      updatedAt: new Date(),
      documentPath: existing.documentPath,
    });

    await this.verificationRepository.save(updated);
    return VerificationMapper.toDto(updated);
  }
}
