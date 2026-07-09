import { Provider } from './provider.entity';
import { ProviderId } from '../value-objects/provider-id.value-object';
import { ProviderStatus } from '../value-objects/provider-status.value-object';
import { ProviderType } from '../value-objects/provider-type.value-object';
import { ProviderExperience } from '../value-objects/provider-experience.value-object';
import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';
import { ProfileId } from '../../../profiles/domain/value-objects/profile-id.value-object';

describe('Provider', () => {
  it('holds all the assigned properties', () => {
    const id = ProviderId.create();
    const identityId = IdentityId.create();
    const providerProfileId = ProfileId.create();
    const now = new Date();
    const provider = new Provider(id, {
      identityId,
      providerProfileId,
      status: ProviderStatus.Active,
      type: ProviderType.Independent,
      experience: ProviderExperience.Advanced,
      biography: 'Electricista con 10 años de experiencia',
      yearsOfExperience: 10,
      createdAt: now,
      updatedAt: now,
    });

    expect(provider.id).toBe(id);
    expect(provider.identityId).toBe(identityId);
    expect(provider.providerProfileId).toBe(providerProfileId);
    expect(provider.status).toBe(ProviderStatus.Active);
    expect(provider.type).toBe(ProviderType.Independent);
    expect(provider.experience).toBe(ProviderExperience.Advanced);
    expect(provider.yearsOfExperience).toBe(10);
  });

  it('is equal to another provider with the same id', () => {
    const id = ProviderId.create();
    const identityId = IdentityId.create();
    const providerProfileId = ProfileId.create();
    const now = new Date();
    const props = {
      identityId,
      providerProfileId,
      status: ProviderStatus.Active,
      type: ProviderType.Independent,
      experience: ProviderExperience.Advanced,
      biography: 'Bio',
      yearsOfExperience: 5,
      createdAt: now,
      updatedAt: now,
    };
    const a = new Provider(id, props);
    const b = new Provider(id, props);
    expect(a.equals(b)).toBe(true);
  });
});
