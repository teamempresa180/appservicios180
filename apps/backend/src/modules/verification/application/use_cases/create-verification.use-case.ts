import { Role } from '../../../../common/auth/role.enum';
import { ForbiddenException } from '../../../core/domain/exceptions/forbidden.exception';
import { NotFoundException } from '../../../core/domain/exceptions/not-found.exception';
import { IdentityRepository } from '../../../identity/domain/interfaces/identity-repository.interface';
import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';
import { Verification } from '../../domain/entities/verification.entity';
import { VerificationRepository } from '../../domain/interfaces/verification-repository.interface';
import { VerificationId } from '../../domain/value-objects/verification-id.value-object';
import { VerificationStatus } from '../../domain/value-objects/verification-status.value-object';
import { CreateVerificationCommand } from '../commands/create-verification.command';
import { VerificationDto } from '../dto/verification.dto';
import { VerificationMapper } from '../mappers/verification.mapper';
import { VerificationValidator } from '../validators/verification.validator';

/**
 * Creates a new Verification record for an existing Identity, always
 * in `Pending` status (nothing in the domain documents an
 * auto-approved starting state) with `verifiedAt` unset. Depends on
 * `IdentityRepository` (not just its own) to verify the referenced
 * Identity actually exists before creating a record for it — same
 * rule already applied to `Authentication`/`Credential`/`Profile`/
 * `Contact`/`Address`, since `Verification` also references
 * `IdentityId`.
 *
 * The record must be for the caller's own Identity (Admins excepted).
 * Otherwise anyone could open KYC records against other people's
 * Identities.
 */
export class CreateVerificationUseCase {
  constructor(
    private readonly verificationRepository: VerificationRepository,
    private readonly identityRepository: IdentityRepository,
  ) {}

  async execute(command: CreateVerificationCommand): Promise<VerificationDto> {
    VerificationValidator.validateCreate(command);

    if (
      command.caller.role !== Role.Admin &&
      command.identityId !== command.caller.id
    ) {
      throw new ForbiddenException(
        'A Verification can only be created for the authenticated Identity',
      );
    }

    const identityId = IdentityId.fromString(command.identityId);
    const identity = await this.identityRepository.findById(identityId);
    if (!identity) {
      throw new NotFoundException(`Identity ${command.identityId} not found`);
    }

    const now = new Date();
    const verification = new Verification(VerificationId.create(), {
      identityId,
      type: command.type,
      status: VerificationStatus.Pending,
      verifiedAt: null,
      createdAt: now,
      updatedAt: now,
      documentPath: null,
    });

    await this.verificationRepository.save(verification);
    return VerificationMapper.toDto(verification);
  }
}
