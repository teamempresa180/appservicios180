import { Role } from '../../../../common/auth/role.enum';
import { ForbiddenException } from '../../../core/domain/exceptions/forbidden.exception';
import { NotFoundException } from '../../../core/domain/exceptions/not-found.exception';
import { Verification } from '../../domain/entities/verification.entity';
import { VerificationRepository } from '../../domain/interfaces/verification-repository.interface';
import { VerificationId } from '../../domain/value-objects/verification-id.value-object';
import { VerificationStatus } from '../../domain/value-objects/verification-status.value-object';
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
 * `Address.city`.
 *
 * `status` is the KYC decision itself, so it is not an ordinary field:
 * before this, any authenticated user could `PUT` their own (or
 * anyone's) Verification to `APPROVED` and become a verified user
 * without a single document being reviewed. The rules now are:
 *
 * - Admin: may set `status` to any value, on any Verification. This is
 *   the only path to `APPROVED`.
 * - Owner (`existing.identityId === caller.id`): may only perform the
 *   `REJECTED -> PENDING` transition — resubmitting after a rejection,
 *   which is exactly what the mobile app does (it sends
 *   `{"status": "PENDING"}` and nothing else). Any other `status`
 *   value, and any transition from a non-`REJECTED` state, is refused.
 * - Anyone else: refused outright.
 *
 * A command with no `status` at all is a no-op update and only needs
 * ownership, not a transition check.
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

    if (command.caller.role !== Role.Admin) {
      if (existing.identityId.value !== command.caller.id) {
        throw new ForbiddenException(
          `Verification ${command.id} does not belong to the authenticated Identity`,
        );
      }
      if (command.status !== undefined) {
        const isResubmission =
          existing.status === VerificationStatus.Rejected &&
          command.status === VerificationStatus.Pending;
        if (!isResubmission) {
          throw new ForbiddenException(
            'Only an administrator can decide a Verification status; the owner may only resubmit a rejected one',
          );
        }
      }
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
