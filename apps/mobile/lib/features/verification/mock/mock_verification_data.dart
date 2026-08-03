import '../../../identity/entities/identity.dart';
import '../../../identity/models/document_type.dart';
import '../../../identity/models/identity_id.dart';
import '../../../identity/models/identity_status.dart';
import '../../../profiles/entities/profile.dart';
import '../../../profiles/models/profile_id.dart';
import '../../../profiles/models/profile_status.dart';
import '../../../profiles/models/profile_visibility.dart';

final DateTime _seedTimestamp = DateTime(2026, 1, 1);

/// Fixed, deterministic mock domain entities for the Verification
/// feature. Intentionally its own set — independent of every other
/// feature's mock data (see the feature README).
final Identity mockVerificationIdentity = Identity(
  id: IdentityId.fromString('verification-identity-diana'),
  fullName: 'Diana Restrepo',
  documentType: DocumentType.nationalId,
  documentNumber: '1094825671',
  birthDate: DateTime(1990, 3, 22),
  status: IdentityStatus.active,
  createdAt: _seedTimestamp,
  updatedAt: _seedTimestamp,
);

final Profile mockVerificationProfile = Profile(
  id: ProfileId.fromString('verification-profile-diana'),
  identityId: mockVerificationIdentity.id,
  displayName: 'Diana Restrepo',
  avatarUrl: null,
  bio:
      'Plomera independiente, especializada en reparaciones '
      'residenciales.',
  visibility: ProfileVisibility.public,
  status: ProfileStatus.active,
  createdAt: _seedTimestamp,
  updatedAt: _seedTimestamp,
);
