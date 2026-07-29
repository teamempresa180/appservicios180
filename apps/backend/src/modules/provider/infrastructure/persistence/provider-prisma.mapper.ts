import { ProviderModel as PrismaProvider } from '@prisma/client';
import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';
import { ProfileId } from '../../../profiles/domain/value-objects/profile-id.value-object';
import { CategoryId } from '../../../category/domain/value-objects/category-id.value-object';
import { Provider } from '../../domain/entities/provider.entity';
import { ProviderId } from '../../domain/value-objects/provider-id.value-object';
import { ProviderExperience } from '../../domain/value-objects/provider-experience.value-object';
import { ProviderStatus } from '../../domain/value-objects/provider-status.value-object';
import { ProviderType } from '../../domain/value-objects/provider-type.value-object';

/**
 * Translates between the `Provider` domain entity and its Prisma row
 * shape (`ProviderModel`, mapped to the `providers` table). The only
 * place in this module that imports from `@prisma/client` — Domain/
 * Application never do.
 */
export class ProviderPrismaMapper {
  static toDomain(row: PrismaProvider): Provider {
    return new Provider(ProviderId.fromString(row.id), {
      identityId: IdentityId.fromString(row.identityId),
      providerProfileId: ProfileId.fromString(row.providerProfileId),
      categoryId: row.categoryId ? CategoryId.fromString(row.categoryId) : null,
      specialization: row.specialization,
      status: row.status as unknown as ProviderStatus,
      type: row.type as unknown as ProviderType,
      experience: row.experience as unknown as ProviderExperience,
      biography: row.biography,
      yearsOfExperience: row.yearsOfExperience,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }

  static toPersistence(provider: Provider): PrismaProvider {
    return {
      id: provider.id.value,
      identityId: provider.identityId.value,
      providerProfileId: provider.providerProfileId.value,
      categoryId: provider.categoryId?.value ?? null,
      specialization: provider.specialization,
      status: provider.status,
      type: provider.type,
      experience: provider.experience,
      biography: provider.biography,
      yearsOfExperience: provider.yearsOfExperience,
      createdAt: provider.createdAt,
      updatedAt: provider.updatedAt,
    };
  }
}
