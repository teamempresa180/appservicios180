import { Role } from '../../../../common/auth/role.enum';
import { BusinessRuleException } from '../../../core/domain/exceptions/business-rule.exception';
import { ForbiddenException } from '../../../core/domain/exceptions/forbidden.exception';
import { NotFoundException } from '../../../core/domain/exceptions/not-found.exception';
import { IdentityRepository } from '../../../identity/domain/interfaces/identity-repository.interface';
import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';
import { Trust } from '../../domain/entities/trust.entity';
import { TrustRepository } from '../../domain/interfaces/trust-repository.interface';
import { TrustId } from '../../domain/value-objects/trust-id.value-object';
import { TrustScore } from '../../domain/value-objects/trust-score.value-object';
import { TrustStatus } from '../../domain/value-objects/trust-status.value-object';
import { CreateTrustProfileCommand } from '../commands/create-trust-profile.command';
import { TrustDto } from '../dto/trust.dto';
import { TrustMapper } from '../mappers/trust.mapper';
import { TrustValidator } from '../validators/trust.validator';

/**
 * Creates a new Trust record for an existing Identity, always in
 * `Active` status. Depends on `IdentityRepository` (not just its own)
 * to verify the referenced Identity actually exists before creating a
 * record for it — same rule already applied to `Authentication`/
 * `Credential`/`Profile`/`Contact`/`Address`/`Verification`. Also
 * enforces the real domain invariant carried by
 * `TrustRepository.findByIdentityId` returning `Trust | null` (not an
 * array, unlike every other module): **at most one Trust record per
 * Identity** — throws `BusinessRuleException` if one already exists.
 *
 * The profile must be for the caller's own Identity (Admins excepted),
 * so nobody can seed a reputation record against somebody else.
 */
export class CreateTrustProfileUseCase {
  constructor(
    private readonly trustRepository: TrustRepository,
    private readonly identityRepository: IdentityRepository,
  ) {}

  async execute(command: CreateTrustProfileCommand): Promise<TrustDto> {
    TrustValidator.validateCreate(command);

    if (
      command.caller.role !== Role.Admin &&
      command.identityId !== command.caller.id
    ) {
      throw new ForbiddenException(
        'A Trust profile can only be created for the authenticated Identity',
      );
    }

    const identityId = IdentityId.fromString(command.identityId);
    const identity = await this.identityRepository.findById(identityId);
    if (!identity) {
      throw new NotFoundException(`Identity ${command.identityId} not found`);
    }

    const existing = await this.trustRepository.findByIdentityId(identityId);
    if (existing) {
      throw new BusinessRuleException(
        `Identity ${command.identityId} already has a Trust record`,
      );
    }

    const now = new Date();
    const trust = new Trust(TrustId.create(), {
      identityId,
      score: TrustScore.of(command.score),
      level: command.level,
      status: TrustStatus.Active,
      createdAt: now,
      updatedAt: now,
    });

    await this.trustRepository.save(trust);
    return TrustMapper.toDto(trust);
  }
}
