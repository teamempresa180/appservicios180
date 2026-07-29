import { NotFoundException } from '../../../core/domain/exceptions/not-found.exception';
import { CategoryId } from '../../../category/domain/value-objects/category-id.value-object';
import { Provider } from '../../domain/entities/provider.entity';
import { ProviderRepository } from '../../domain/interfaces/provider-repository.interface';
import { ProviderId } from '../../domain/value-objects/provider-id.value-object';
import { UpdateProviderCommand } from '../commands/update-provider.command';
import { ProviderDto } from '../dto/provider.dto';
import { ProviderMapper } from '../mappers/provider.mapper';
import { ProviderValidator } from '../validators/provider.validator';

/**
 * Updates the mutable fields of an existing Provider (`biography`,
 * `experience`, `status`) — `identityId`/`providerProfileId`/`type`/
 * `yearsOfExperience` are not offered by `UpdateProviderCommand`, so
 * they stay untouched. Reassigning a Provider to a different Identity
 * is structurally impossible here, same criterion as `Trust`'s 1:1
 * `identityId`.
 */
export class UpdateProviderUseCase {
  constructor(private readonly providerRepository: ProviderRepository) {}

  async execute(command: UpdateProviderCommand): Promise<ProviderDto> {
    ProviderValidator.validateUpdate(command);

    const id = ProviderId.fromString(command.id);
    const existing = await this.providerRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(`Provider ${command.id} not found`);
    }

    const updated = new Provider(existing.id, {
      identityId: existing.identityId,
      providerProfileId: existing.providerProfileId,
      categoryId: command.categoryId
        ? CategoryId.fromString(command.categoryId)
        : existing.categoryId,
      specialization: command.specialization ?? existing.specialization,
      status: command.status ?? existing.status,
      type: existing.type,
      experience: command.experience ?? existing.experience,
      biography: command.biography ?? existing.biography,
      yearsOfExperience: existing.yearsOfExperience,
      createdAt: existing.createdAt,
      updatedAt: new Date(),
    });

    await this.providerRepository.save(updated);
    return ProviderMapper.toDto(updated);
  }
}
