import '../../../authentication/entities/authentication.dart';
import '../../../authentication/models/auth_method_type.dart';
import '../../../authentication/models/authentication_id.dart';
import '../../../authentication/models/authentication_status.dart';
import '../../../identity/entities/identity.dart';
import '../../../identity/models/document_type.dart';
import '../../../identity/models/identity_id.dart';
import '../../../identity/models/identity_status.dart';

final DateTime _seedTimestamp = DateTime(2026, 1, 1);

final IdentityId _identityId = IdentityId.fromString(
  'security-identity-camila',
);

/// Fixed, deterministic mock domain entities for the Security feature.
/// Intentionally its own set — independent of every other feature's
/// mock data (see the feature README).
final Identity mockSecurityIdentity = Identity(
  id: _identityId,
  fullName: 'Camila Torres',
  documentType: DocumentType.nationalId,
  documentNumber: '1020304050',
  birthDate: DateTime(1994, 7, 18),
  status: IdentityStatus.active,
  createdAt: _seedTimestamp,
  updatedAt: _seedTimestamp,
);

/// Five real `Authentication` records covering every `AuthMethodType`
/// and every `AuthenticationStatus` at least once.
final List<Authentication> mockAuthMethods = [
  Authentication(
    id: AuthenticationId.fromString('security-auth-password'),
    identityId: _identityId,
    methodType: AuthMethodType.password,
    status: AuthenticationStatus.active,
    createdAt: _seedTimestamp,
    updatedAt: _seedTimestamp,
  ),
  Authentication(
    id: AuthenticationId.fromString('security-auth-biometric'),
    identityId: _identityId,
    methodType: AuthMethodType.biometric,
    status: AuthenticationStatus.active,
    createdAt: _seedTimestamp,
    updatedAt: _seedTimestamp,
  ),
  Authentication(
    id: AuthenticationId.fromString('security-auth-otp'),
    identityId: _identityId,
    methodType: AuthMethodType.oneTimeCode,
    status: AuthenticationStatus.locked,
    createdAt: _seedTimestamp,
    updatedAt: _seedTimestamp,
  ),
  Authentication(
    id: AuthenticationId.fromString('security-auth-third-party'),
    identityId: _identityId,
    methodType: AuthMethodType.thirdParty,
    status: AuthenticationStatus.inactive,
    createdAt: _seedTimestamp,
    updatedAt: _seedTimestamp,
  ),
  Authentication(
    id: AuthenticationId.fromString('security-auth-other'),
    identityId: _identityId,
    methodType: AuthMethodType.other,
    status: AuthenticationStatus.revoked,
    createdAt: _seedTimestamp,
    updatedAt: _seedTimestamp,
  ),
];
