import { Provider } from '../entities/provider.entity';
import { ProviderId } from '../value-objects/provider-id.value-object';
import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';

/**
 * Contract for Provider persistence. No implementation lives in this
 * module — concrete repositories belong to the infrastructure layer, not yet built.
 */
export interface ProviderRepository {
  findById(id: ProviderId): Promise<Provider | null>;
  findByIdentityId(identityId: IdentityId): Promise<Provider | null>;
  save(provider: Provider): Promise<void>;
}
