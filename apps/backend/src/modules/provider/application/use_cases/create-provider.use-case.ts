import { BusinessRuleException } from '../../../core/domain/exceptions/business-rule.exception';
import { NotFoundException } from '../../../core/domain/exceptions/not-found.exception';
import { IdentityRepository } from '../../../identity/domain/interfaces/identity-repository.interface';
import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';
import { ProfileRepository } from '../../../profiles/domain/interfaces/profile-repository.interface';
import { ProfileId } from '../../../profiles/domain/value-objects/profile-id.value-object';
import { CategoryRepository } from '../../../category/domain/interfaces/category-repository.interface';
import { CategoryId } from '../../../category/domain/value-objects/category-id.value-object';
import { CategorySpecializationRepository } from '../../../category/domain/interfaces/category-specialization-repository.interface';
import { SpecializationId } from '../../../category/domain/value-objects/specialization-id.value-object';
import { Provider } from '../../domain/entities/provider.entity';
import { ProviderRepository } from '../../domain/interfaces/provider-repository.interface';
import { ProviderId } from '../../domain/value-objects/provider-id.value-object';
import { ProviderStatus } from '../../domain/value-objects/provider-status.value-object';
import { CreateProviderCommand } from '../commands/create-provider.command';
import { ProviderDto } from '../dto/provider.dto';
import { ProviderMapper } from '../mappers/provider.mapper';
import { ProviderValidator } from '../validators/provider.validator';

/**
 * Creates a new Provider for an existing Identity, always in `Pending`
 * status. New providers start `Pending` until their submitted
 * verification documents (criminal record check + professional
 * certification, via `POST /verifications/:id/document`) are reviewed
 * and approved; approval today happens through the already-existing
 * `PUT /providers/:id` endpoint (which already accepts an optional
 * `status` field), since this backend has no admin/staff role model
 * yet to gate that transition specially. Depends on
 * `IdentityRepository` and `ProfileRepository` (not just its own) to
 * verify both the referenced Identity and the referenced Profile
 * (`providerProfileId`) actually exist before creating a record —
 * `Profile` already has Infrastructure since Sprint 3 Etapa 3, so this
 * check is real, not deferred. Also enforces the real domain invariant
 * carried by `ProviderRepository.findByIdentityId` returning
 * `Provider | null` (not an array, same shape as `Trust`): **at most
 * one Provider record per Identity** — throws `BusinessRuleException`
 * if one already exists.
 *
 * When `specializationId` is provided (`ProviderValidator` already
 * requires `categoryId` alongside it), also verifies the referenced
 * `CategorySpecialization` exists and actually belongs to the
 * referenced Category — a real business rule (a Provider cannot claim
 * "Paneles solares" under "Plomería"), not just type-safety.
 */
export class CreateProviderUseCase {
  constructor(
    private readonly providerRepository: ProviderRepository,
    private readonly identityRepository: IdentityRepository,
    private readonly profileRepository: ProfileRepository,
    private readonly categoryRepository?: CategoryRepository,
    private readonly categorySpecializationRepository?: CategorySpecializationRepository,
  ) {}

  async execute(command: CreateProviderCommand): Promise<ProviderDto> {
    ProviderValidator.validateCreate(command);

    const identityId = IdentityId.fromString(command.identityId);
    const identity = await this.identityRepository.findById(identityId);
    if (!identity) {
      throw new NotFoundException(`Identity ${command.identityId} not found`);
    }

    const providerProfileId = ProfileId.fromString(command.providerProfileId);
    const profile = await this.profileRepository.findById(providerProfileId);
    if (!profile) {
      throw new NotFoundException(
        `Profile ${command.providerProfileId} not found`,
      );
    }

    const existing = await this.providerRepository.findByIdentityId(identityId);
    if (existing) {
      throw new BusinessRuleException(
        `Identity ${command.identityId} already has a Provider record`,
      );
    }

    let categoryId: CategoryId | null = null;
    if (command.categoryId) {
      categoryId = CategoryId.fromString(command.categoryId);
      if (this.categoryRepository) {
        const category = await this.categoryRepository.findById(categoryId);
        if (!category) {
          throw new NotFoundException(
            `Category ${command.categoryId} not found`,
          );
        }
      }
    }

    let specializationId: SpecializationId | null = null;
    if (command.specializationId) {
      specializationId = SpecializationId.fromString(command.specializationId);
      if (this.categorySpecializationRepository && categoryId) {
        const specialization = await this.categorySpecializationRepository.findById(
          specializationId,
        );
        if (!specialization) {
          throw new NotFoundException(
            `Specialization ${command.specializationId} not found`,
          );
        }
        if (!specialization.categoryId.equals(categoryId)) {
          throw new BusinessRuleException(
            `Specialization ${command.specializationId} does not belong to Category ${command.categoryId}`,
          );
        }
      }
    }

    const now = new Date();
    const provider = new Provider(ProviderId.create(), {
      identityId,
      providerProfileId,
      categoryId,
      specializationId,
      status: ProviderStatus.Pending,
      type: command.type,
      experience: command.experience,
      biography: command.biography,
      yearsOfExperience: command.yearsOfExperience,
      createdAt: now,
      updatedAt: now,
    });

    await this.providerRepository.save(provider);
    return ProviderMapper.toDto(provider);
  }
}
