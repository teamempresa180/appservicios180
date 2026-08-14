import { AuthenticatedUser } from '../../../../common/auth/authenticated-user.interface';
import { Role } from '../../../../common/auth/role.enum';
import { BusinessRuleException } from '../../../core/domain/exceptions/business-rule.exception';
import { ForbiddenException } from '../../../core/domain/exceptions/forbidden.exception';
import { NotFoundException } from '../../../core/domain/exceptions/not-found.exception';
import { CategoryId } from '../../../category/domain/value-objects/category-id.value-object';
import { CategorySpecializationRepository } from '../../../category/domain/interfaces/category-specialization-repository.interface';
import { SpecializationId } from '../../../category/domain/value-objects/specialization-id.value-object';
import { Provider } from '../../domain/entities/provider.entity';
import { ProviderRepository } from '../../domain/interfaces/provider-repository.interface';
import { ProviderId } from '../../domain/value-objects/provider-id.value-object';
import { ProviderStatus } from '../../domain/value-objects/provider-status.value-object';
import { UpdateProviderCommand } from '../commands/update-provider.command';
import { ProviderDto } from '../dto/provider.dto';
import { ProviderMapper } from '../mappers/provider.mapper';
import { ProviderValidator } from '../validators/provider.validator';

/**
 * Updates the mutable fields of an existing Provider (`biography`,
 * `experience`, `status`, `categoryId`/`specializationId`) —
 * `identityId`/`providerProfileId`/`type`/`yearsOfExperience` are not
 * offered by `UpdateProviderCommand`, so they stay untouched.
 * Reassigning a Provider to a different Identity is structurally
 * impossible here, same criterion as `Trust`'s 1:1 `identityId`. When
 * `specializationId` is provided (`ProviderValidator` already requires
 * `categoryId` alongside it), also verifies the referenced
 * `CategorySpecialization` exists and actually belongs to the
 * resulting Category — same real business rule as
 * `CreateProviderUseCase`.
 *
 * Authorization (Sprint 4, Etapa 18). `status` is the sensitive field:
 * left ungated it let any authenticated caller self-approve as a
 * Provider by sending `{"status":"ACTIVE"}`. The rules are:
 *
 * - `Admin` may edit any Provider and set `status` to any value.
 * - The owner (`existing.identityId === caller.id`) may freely edit
 *   `biography`/`experience`/`categoryId`/`specializationId`, but the
 *   only `status` transition available to them is `Rejected → Pending`
 *   — resubmitting an application after a rejection, which is the sole
 *   status write the mobile client performs
 *   (`http_become_provider_repository.dart` sends `{'status':
 *   'PENDING'}`). Every other `status` value, `Active` included, is
 *   rejected with `ForbiddenException`.
 * - Anyone else is refused the update outright.
 */
export class UpdateProviderUseCase {
  constructor(
    private readonly providerRepository: ProviderRepository,
    private readonly categorySpecializationRepository?: CategorySpecializationRepository,
  ) {}

  async execute(
    command: UpdateProviderCommand,
    caller: AuthenticatedUser,
  ): Promise<ProviderDto> {
    ProviderValidator.validateUpdate(command);

    const id = ProviderId.fromString(command.id);
    const existing = await this.providerRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(`Provider ${command.id} not found`);
    }

    if (caller.role !== Role.Admin) {
      if (existing.identityId.value !== caller.id) {
        throw new ForbiddenException(
          'Only the owning Identity or an Admin may update this Provider',
        );
      }
      if (
        command.status !== undefined &&
        !(
          existing.status === ProviderStatus.Rejected &&
          command.status === ProviderStatus.Pending
        )
      ) {
        throw new ForbiddenException(
          'Only an Admin may change a Provider status; the owner may only resubmit a rejected application (REJECTED to PENDING)',
        );
      }
    }

    const categoryId = command.categoryId
      ? CategoryId.fromString(command.categoryId)
      : existing.categoryId;

    let specializationId: SpecializationId | null = command.specializationId
      ? SpecializationId.fromString(command.specializationId)
      : existing.specializationId;

    if (command.specializationId && specializationId) {
      if (this.categorySpecializationRepository && categoryId) {
        const specialization =
          await this.categorySpecializationRepository.findById(
            specializationId,
          );
        if (!specialization) {
          throw new NotFoundException(
            `Specialization ${command.specializationId} not found`,
          );
        }
        if (!specialization.categoryId.equals(categoryId)) {
          throw new BusinessRuleException(
            `Specialization ${command.specializationId} does not belong to Category ${categoryId.value}`,
          );
        }
      }
    }

    const updated = new Provider(existing.id, {
      identityId: existing.identityId,
      providerProfileId: existing.providerProfileId,
      categoryId,
      specializationId,
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
