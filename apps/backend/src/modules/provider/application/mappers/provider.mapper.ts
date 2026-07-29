import { Provider } from '../../domain/entities/provider.entity';
import { ProviderDto } from '../dto/provider.dto';

/**
 * Translates between the Provider domain entity and its DTOs.
 * Simple field-by-field mapping only — no business logic.
 */
export class ProviderMapper {
  static toDto(provider: Provider): ProviderDto {
    const dto = new ProviderDto();
    dto.id = provider.id.value;
    dto.identityId = provider.identityId.value;
    dto.providerProfileId = provider.providerProfileId.value;
    dto.categoryId = provider.categoryId?.value ?? null;
    dto.specialization = provider.specialization;
    dto.status = provider.status;
    dto.type = provider.type;
    dto.experience = provider.experience;
    dto.biography = provider.biography;
    dto.yearsOfExperience = provider.yearsOfExperience;
    dto.createdAt = provider.createdAt;
    dto.updatedAt = provider.updatedAt;
    return dto;
  }
}
