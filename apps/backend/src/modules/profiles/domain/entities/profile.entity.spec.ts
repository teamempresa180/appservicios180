import { Profile } from './profile.entity';
import { ProfileId } from '../value-objects/profile-id.value-object';
import { ProfileVisibility } from '../value-objects/profile-visibility.value-object';
import { ProfileStatus } from '../value-objects/profile-status.value-object';
import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';

describe('Profile', () => {
  it('holds all the assigned properties', () => {
    const id = ProfileId.create();
    const identityId = IdentityId.create();
    const now = new Date();
    const profile = new Profile(id, {
      identityId,
      displayName: 'Ana G.',
      avatarUrl: 'https://example.com/avatar.png',
      bio: 'Hola, soy Ana',
      visibility: ProfileVisibility.Public,
      status: ProfileStatus.Active,
      createdAt: now,
      updatedAt: now,
    });

    expect(profile.id).toBe(id);
    expect(profile.identityId).toBe(identityId);
    expect(profile.displayName).toBe('Ana G.');
    expect(profile.visibility).toBe(ProfileVisibility.Public);
    expect(profile.status).toBe(ProfileStatus.Active);
  });
});
