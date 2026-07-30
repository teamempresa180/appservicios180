import '../../../category/entities/category.dart';
import '../../../provider/entities/provider.dart';
import '../../../verification/entities/verification.dart';
import '../models/provider_application.dart';

/// Contract for the "become a provider" application flow — reachable
/// from Profile ("Quiero convertirme en proveedor"), independent of
/// Register: the applicant is already a logged-in Customer and only
/// fills in professional information (no personal data re-entry).
///
/// Implemented by `MockBecomeProviderRepository` and
/// `HttpBecomeProviderRepository` (the real backend calls).
abstract class BecomeProviderRepository {
  /// Returns the caller's own `Provider` record, if one already exists
  /// (i.e. they already applied at least once), or `null` if they
  /// never have. `ProfilePage` only offers "Quiero convertirme en
  /// proveedor" while the session's role is still Customer (see
  /// `SessionManager.currentRole`/backend `login.use-case.ts`), which
  /// stays true for every non-Active Provider status — so a returning
  /// applicant would otherwise see this same entry point and risk
  /// filing a second application. [BecomeProviderPage] calls this
  /// first and shows the existing status instead of the wizard when
  /// it returns non-null and non-active.
  Future<Provider?> getExistingApplication();

  Future<List<Category>> getCategories();

  /// Creates the real `Provider` record (backend default status:
  /// `PENDING`, until the two uploaded documents are reviewed) and
  /// the two `Verification` records the caller must then upload a
  /// document against via [uploadDocument]. [category]/[specialization]
  /// have no dedicated field on `Provider` — see
  /// `HttpBecomeProviderRepository`'s doc comment for how they're
  /// honestly represented instead of silently dropped.
  Future<ProviderApplication> apply({
    required Category category,
    required String specialization,
    required int yearsOfExperience,
    required String biography,
    required String city,
    required String department,
    required String coverage,
  });

  /// Uploads [fileBytes] (named [fileName], `application/pdf` or
  /// `image/png`/`image/jpeg`) against [verification] via
  /// `POST /verifications/:id/document`. [onProgress] receives values
  /// in `[0, 1]`. Safe to retry — a failed call leaves the
  /// `Verification` record unchanged, so the caller can call this
  /// again with the same or a different file.
  Future<Verification> uploadDocument({
    required Verification verification,
    required List<int> fileBytes,
    required String fileName,
    void Function(double progress)? onProgress,
  });
}
