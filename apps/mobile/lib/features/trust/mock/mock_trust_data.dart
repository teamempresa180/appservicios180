import '../../../identity/entities/identity.dart';
import '../../../identity/models/document_type.dart';
import '../../../identity/models/identity_id.dart';
import '../../../identity/models/identity_status.dart';
import '../../../trust/entities/trust.dart';
import '../../../trust/models/trust_id.dart';
import '../../../trust/models/trust_level.dart';
import '../../../trust/models/trust_score.dart';
import '../../../trust/models/trust_status.dart';

final DateTime _createdTimestamp = DateTime(2025, 6, 10);
final DateTime _updatedTimestamp = DateTime(2026, 6, 1);

/// Fixed, deterministic mock domain entities for the Trust feature.
/// Intentionally its own set — independent of every other feature's
/// mock data (see the feature README).
final Identity mockTrustIdentity = Identity(
  id: IdentityId.fromString('trust-identity-julian'),
  fullName: 'Julián Cárdenas',
  documentType: DocumentType.nationalId,
  documentNumber: '1017346298',
  birthDate: DateTime(1988, 11, 5),
  status: IdentityStatus.active,
  createdAt: _createdTimestamp,
  updatedAt: _updatedTimestamp,
);

final Trust mockTrust = Trust(
  id: TrustId.fromString('trust-record-julian'),
  identityId: mockTrustIdentity.id,
  score: const TrustScore.of(87.5),
  level: TrustLevel.high,
  status: TrustStatus.active,
  createdAt: _createdTimestamp,
  updatedAt: _updatedTimestamp,
);

/// Simulated content not modeled by any domain entity — the domain
/// `Trust` entity is explicitly documented as "no scoring logic", so
/// there is no real breakdown of *why* the score is what it is. See
/// `TrustDisplay` and the feature README for why this stays simulated.
const List<String> mockTrustFactors = [
  'Historial de servicios completados a tiempo',
  'Verificación de identidad aprobada',
  'Calificaciones positivas de clientes',
  'Antigüedad como proveedor activo',
];
