import '../../../identity/models/identity_id.dart';
import '../../../profiles/entities/profile.dart';
import '../../../profiles/models/profile_id.dart';
import '../../../profiles/models/profile_status.dart';
import '../../../profiles/models/profile_visibility.dart';
import '../models/settings_option.dart';

final DateTime _seedTimestamp = DateTime(2026, 1, 1);

/// Fixed, deterministic mock domain entity for the Settings feature.
/// Intentionally its own set — independent of every other feature's
/// mock data (see the feature README).
final Profile mockSettingsProfile = Profile(
  id: ProfileId.fromString('settings-profile-client'),
  identityId: IdentityId.fromString('settings-identity-client'),
  displayName: 'Camila Torres',
  avatarUrl: null,
  bio: 'Cliente frecuente de servicios del hogar.',
  visibility: ProfileVisibility.public,
  status: ProfileStatus.active,
  createdAt: _seedTimestamp,
  updatedAt: _seedTimestamp,
);

/// Simulated menu — see `SettingsDisplay` and the feature README.
const List<SettingsOptionId> mockSettingsOptions = [
  SettingsOptionId.addresses,
  SettingsOptionId.contacts,
  SettingsOptionId.security,
  SettingsOptionId.notifications,
  SettingsOptionId.privacy,
  SettingsOptionId.help,
  SettingsOptionId.logout,
];
