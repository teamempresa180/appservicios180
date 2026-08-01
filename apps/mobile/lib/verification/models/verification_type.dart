/// What aspect of an Identity is being verified. [criminalRecord] and
/// [certification] are the original, coarse-grained "become a
/// provider" document types (kept for backward compatibility); the
/// seven values from [identityDocument] through [professionalCard] are
/// the fine-grained per-document types the current provider-
/// application wizard uses instead (see
/// `become_provider/models/required_provider_documents.dart`).
///
/// The seven fine-grained values are placeholder-but-real string
/// values agreed with the backend team while the backend's own
/// `VerificationType` enum is extended in parallel to match (see
/// Prompt 13's notes). If the backend's final names differ
/// byte-for-byte, only the `enumToJson`/`enumFromJson` round trip (or
/// these member names) needs a one-line reconciliation, not the wizard
/// itself.
enum VerificationType {
  document,
  facial,
  address,
  phone,
  email,
  criminalRecord,
  certification,
  other,
  identityDocument,
  policeRecord,
  procuratorRecord,
  workCertificate,
  educationCertificate,
  license,
  professionalCard,
}
