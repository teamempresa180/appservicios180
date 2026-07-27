import '../../../provider/entities/provider.dart';
import '../../../verification/entities/verification.dart';

/// Result of submitting the "become a provider" application: the real
/// `Provider` record (created in `ProviderStatus.pending`) plus the
/// two real `Verification` records the applicant must upload a
/// document against — one for the criminal-record check, one for the
/// professional certification/degree.
class ProviderApplication {
  const ProviderApplication({
    required this.provider,
    required this.criminalRecordVerification,
    required this.certificationVerification,
  });

  final Provider provider;
  final Verification criminalRecordVerification;
  final Verification certificationVerification;
}
