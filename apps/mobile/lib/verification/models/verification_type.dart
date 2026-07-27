/// What aspect of an Identity is being verified. [criminalRecord] and
/// [certification] back the "become a provider" document review (a
/// criminal-record check and a professional certification/degree).
enum VerificationType {
  document,
  facial,
  address,
  phone,
  email,
  criminalRecord,
  certification,
  other,
}
