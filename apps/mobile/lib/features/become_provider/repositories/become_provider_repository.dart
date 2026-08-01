import '../../../category/entities/category.dart';
import '../../../provider/entities/provider.dart';
import '../../../verification/entities/verification.dart';

/// Contract for the "become a provider" application flow — reachable
/// from Profile ("Quiero convertirme en proveedor"), independent of
/// Register: the applicant is already a logged-in Customer. Personal
/// data already captured at registration (identity document) or that
/// belongs to other features (photo → `ProfileRepository`, address →
/// `AddressManagementRepository`, phone → `ContactManagementRepository`)
/// is *not* re-collected here — this repository only covers what's
/// specific to becoming a provider: the category/specialization,
/// professional experience, the 7 required verification documents, and
/// the final `Provider` record itself.
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

  /// Returns the real `Verification` records the document upload step
  /// (Paso 4) needs — one per type in `requiredProviderDocuments`,
  /// creating any that don't exist yet for the current identity.
  /// Always returns exactly `requiredProviderDocuments.length` records,
  /// in that same order. Safe to call again (e.g. the applicant
  /// reopens the wizard mid-upload): already-created records for a
  /// type are reused rather than duplicated — see
  /// `HttpBecomeProviderRepository`'s doc comment for the one caveat
  /// on how "already created" is detected today.
  Future<List<Verification>> ensureDocumentVerifications();

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

  /// Creates the real `Provider` record (backend default status:
  /// `PENDING`, until the uploaded documents are reviewed) — the
  /// wizard's one irreversible action, called only after the applicant
  /// confirms Paso 5 ("Resumen"). By this point the photo, address,
  /// phone and all 7 documents have already been saved/uploaded
  /// directly through their own repositories — this call only carries
  /// the fields that are specific to the `Provider` record itself.
  Future<Provider> apply({
    required Category category,
    required String specializationName,
    required int yearsOfExperience,
    String? previousCompany,
    required bool isIndependent,
    required String biography,
  });

  /// Resets a rejected [verification] back to `pending` after the
  /// applicant re-uploads its document — part of "volver a enviar"
  /// (see `RejectedApplicationView`). Uses the real, already-existing
  /// `PUT /verifications/:id` endpoint (`status` is one of its
  /// updatable fields); no backend change needed.
  Future<Verification> resetVerificationStatus(Verification verification);

  /// Resets a rejected [provider] back to `pending` once every
  /// rejected document has been re-uploaded — the last step of
  /// "volver a enviar". Uses the real, already-existing
  /// `PUT /providers/:id` endpoint (`status` is one of its updatable
  /// fields); no backend change needed.
  Future<Provider> resetProviderStatus(Provider provider);
}
