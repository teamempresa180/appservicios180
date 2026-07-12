import { NotFoundException } from '../../../core/domain/exceptions/not-found.exception';
import { Trust } from '../../domain/entities/trust.entity';
import { TrustRepository } from '../../domain/interfaces/trust-repository.interface';
import { TrustId } from '../../domain/value-objects/trust-id.value-object';
import { TrustScore } from '../../domain/value-objects/trust-score.value-object';
import { UpdateTrustProfileCommand } from '../commands/update-trust-profile.command';
import { TrustDto } from '../dto/trust.dto';
import { TrustMapper } from '../mappers/trust.mapper';
import { TrustValidator } from '../validators/trust.validator';

/**
 * Updates the mutable fields of an existing Trust record (`score`,
 * `level`, `status`). `identityId` is never offered by
 * `UpdateTrustProfileCommand` — reassigning a Trust record to a
 * different Identity would violate the 1:1 invariant enforced at
 * creation, so it's structurally impossible here.
 */
export class UpdateTrustProfileUseCase {
  constructor(private readonly trustRepository: TrustRepository) {}

  async execute(command: UpdateTrustProfileCommand): Promise<TrustDto> {
    TrustValidator.validateUpdate(command);

    const id = TrustId.fromString(command.id);
    const existing = await this.trustRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(`Trust ${command.id} not found`);
    }

    const updated = new Trust(existing.id, {
      identityId: existing.identityId,
      score:
        command.score !== undefined
          ? TrustScore.of(command.score)
          : existing.score,
      level: command.level ?? existing.level,
      status: command.status ?? existing.status,
      createdAt: existing.createdAt,
      updatedAt: new Date(),
    });

    await this.trustRepository.save(updated);
    return TrustMapper.toDto(updated);
  }
}
