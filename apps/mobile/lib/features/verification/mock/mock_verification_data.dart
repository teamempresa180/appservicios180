import '../../../identity/entities/identity.dart';
import '../../../identity/models/document_type.dart';
import '../../../identity/models/identity_id.dart';
import '../../../identity/models/identity_status.dart';
import '../../../profiles/entities/profile.dart';
import '../../../profiles/models/profile_id.dart';
import '../../../profiles/models/profile_status.dart';
import '../../../profiles/models/profile_visibility.dart';
import '../models/verification_status_display.dart';

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

/// Simulated content not modeled by any domain entity used in this
/// feature — see `VerificationDisplay` and the feature README for why
/// each exists.
const VerificationStatusDisplay mockVerificationStatus =
    VerificationStatusDisplay.pending;

const List<String> mockVerificationCompletedSteps = [
  'Documento de identidad subido',
  'Selfie capturada',
];

const List<String> mockVerificationPendingSteps = [
  'Revisión manual del equipo de confianza',
];

/// Only meaningful when `mockVerificationStatus` is `rejected` — kept
/// `null` here since the mock status is `pending`.
const String? mockVerificationRejectedReason = null;

const String mockVerificationEstimatedReviewTime =
    'Aproximadamente 24 a 48 horas hábiles';
