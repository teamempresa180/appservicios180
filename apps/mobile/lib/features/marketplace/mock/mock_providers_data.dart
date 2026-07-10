import '../../../identity/models/identity_id.dart';
import '../../../profiles/entities/profile.dart';
import '../../../profiles/models/profile_id.dart';
import '../../../profiles/models/profile_status.dart';
import '../../../profiles/models/profile_visibility.dart';
import '../../../provider/entities/provider.dart';
import '../../../provider/models/provider_experience.dart';
import '../../../provider/models/provider_id.dart';
import '../../../provider/models/provider_status.dart';
import '../../../provider/models/provider_type.dart';

final DateTime _seedTimestamp = DateTime(2026, 1, 1);

/// Fixed, deterministic mock [Provider] entities. `Provider` (per the
/// domain model) has no display name of its own — it only references a
/// [Profile] by [ProfileId] — so [mockProfiles] below carries the name
/// shown in the UI. See the feature README for why these stay separate.
final List<Provider> mockProviders = [
  Provider(
    id: ProviderId.fromString('provider-ana'),
    identityId: IdentityId.fromString('identity-ana'),
    providerProfileId: ProfileId.fromString('profile-ana'),
    status: ProviderStatus.active,
    type: ProviderType.independent,
    experience: ProviderExperience.advanced,
    biography:
        'Especialista en plomería residencial con más de 8 años '
        'de experiencia.',
    yearsOfExperience: 8,
    createdAt: _seedTimestamp,
    updatedAt: _seedTimestamp,
  ),
  Provider(
    id: ProviderId.fromString('provider-carlos'),
    identityId: IdentityId.fromString('identity-carlos'),
    providerProfileId: ProfileId.fromString('profile-carlos'),
    status: ProviderStatus.active,
    type: ProviderType.freelancer,
    experience: ProviderExperience.expert,
    biography:
        'Electricista certificado, instalaciones residenciales '
        'y comerciales.',
    yearsOfExperience: 12,
    createdAt: _seedTimestamp,
    updatedAt: _seedTimestamp,
  ),
  Provider(
    id: ProviderId.fromString('provider-lucia'),
    identityId: IdentityId.fromString('identity-lucia'),
    providerProfileId: ProfileId.fromString('profile-lucia'),
    status: ProviderStatus.active,
    type: ProviderType.company,
    experience: ProviderExperience.intermediate,
    biography: 'Equipo de limpieza profesional para hogares y oficinas.',
    yearsOfExperience: 5,
    createdAt: _seedTimestamp,
    updatedAt: _seedTimestamp,
  ),
  Provider(
    id: ProviderId.fromString('provider-jorge'),
    identityId: IdentityId.fromString('identity-jorge'),
    providerProfileId: ProfileId.fromString('profile-jorge'),
    status: ProviderStatus.active,
    type: ProviderType.independent,
    experience: ProviderExperience.beginner,
    biography: 'Jardinero independiente, mantenimiento de áreas verdes.',
    yearsOfExperience: 2,
    createdAt: _seedTimestamp,
    updatedAt: _seedTimestamp,
  ),
];

/// Mock [Profile] entities matching [mockProviders] one-to-one by
/// [ProfileId] — the source of each provider's `displayName`.
final List<Profile> mockProviderProfiles = [
  Profile(
    id: ProfileId.fromString('profile-ana'),
    identityId: IdentityId.fromString('identity-ana'),
    displayName: 'Ana Torres',
    avatarUrl: null,
    bio: mockProviders[0].biography,
    visibility: ProfileVisibility.public,
    status: ProfileStatus.active,
    createdAt: _seedTimestamp,
    updatedAt: _seedTimestamp,
  ),
  Profile(
    id: ProfileId.fromString('profile-carlos'),
    identityId: IdentityId.fromString('identity-carlos'),
    displayName: 'Carlos Ramírez',
    avatarUrl: null,
    bio: mockProviders[1].biography,
    visibility: ProfileVisibility.public,
    status: ProfileStatus.active,
    createdAt: _seedTimestamp,
    updatedAt: _seedTimestamp,
  ),
  Profile(
    id: ProfileId.fromString('profile-lucia'),
    identityId: IdentityId.fromString('identity-lucia'),
    displayName: 'Lucía Fernández',
    avatarUrl: null,
    bio: mockProviders[2].biography,
    visibility: ProfileVisibility.public,
    status: ProfileStatus.active,
    createdAt: _seedTimestamp,
    updatedAt: _seedTimestamp,
  ),
  Profile(
    id: ProfileId.fromString('profile-jorge'),
    identityId: IdentityId.fromString('identity-jorge'),
    displayName: 'Jorge Medina',
    avatarUrl: null,
    bio: mockProviders[3].biography,
    visibility: ProfileVisibility.public,
    status: ProfileStatus.active,
    createdAt: _seedTimestamp,
    updatedAt: _seedTimestamp,
  ),
];

/// Simulated ratings and service counts, keyed by provider id value.
/// Not part of any domain entity — `Review`/`Service` aggregates would
/// compute these for real; here they are plain simulated numbers (see
/// the feature README).
final Map<String, double> mockProviderRatings = {
  'provider-ana': 4.8,
  'provider-carlos': 4.9,
  'provider-lucia': 4.6,
  'provider-jorge': 4.3,
};

final Map<String, int> mockProviderServicesCount = {
  'provider-ana': 3,
  'provider-carlos': 4,
  'provider-lucia': 2,
  'provider-jorge': 1,
};
