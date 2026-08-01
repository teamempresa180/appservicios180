import '../../../category/entities/category.dart';
import '../../../identity/models/identity_id.dart';
import '../../../provider/entities/provider.dart';
import '../../../provider/models/provider_experience.dart';
import '../../../provider/models/provider_id.dart';
import '../../../provider/models/provider_status.dart';
import '../../../provider/models/provider_type.dart';
import '../../../profiles/models/profile_id.dart';
import '../../../verification/entities/verification.dart';
import '../../../verification/models/verification_id.dart';
import '../../../verification/models/verification_status.dart';
import '../../categories/repositories/category_repository.dart';
import '../models/required_provider_documents.dart';
import 'become_provider_repository.dart';

/// In-memory `BecomeProviderRepository` — no backend, no persistence,
/// no network. Delegates category reads to the injected
/// [CategoryRepository] rather than keeping its own mock list.
class MockBecomeProviderRepository implements BecomeProviderRepository {
  MockBecomeProviderRepository(this._categoryRepository);

  final CategoryRepository _categoryRepository;

  static final IdentityId _identityId = IdentityId.fromString(
    'become-provider-mock-identity',
  );

  final List<Verification> _documentVerifications = [];

  @override
  Future<Provider?> getExistingApplication() async => null;

  @override
  Future<List<Category>> getCategories() => _categoryRepository.getAll();

  ProviderExperience _experienceFor(int years) {
    if (years < 2) return ProviderExperience.beginner;
    if (years < 5) return ProviderExperience.intermediate;
    if (years < 10) return ProviderExperience.advanced;
    return ProviderExperience.expert;
  }

  @override
  Future<List<Verification>> ensureDocumentVerifications() async {
    if (_documentVerifications.isEmpty) {
      final now = DateTime.now();
      _documentVerifications.addAll([
        for (final type in requiredProviderDocuments)
          Verification(
            id: VerificationId.create(),
            identityId: _identityId,
            type: type,
            status: VerificationStatus.pending,
            verifiedAt: null,
            createdAt: now,
            updatedAt: now,
          ),
      ]);
    }
    return List.unmodifiable(_documentVerifications);
  }

  @override
  Future<Verification> uploadDocument({
    required Verification verification,
    required List<int> fileBytes,
    required String fileName,
    void Function(double progress)? onProgress,
  }) async {
    onProgress?.call(1);
    final updated = Verification(
      id: verification.id,
      identityId: verification.identityId,
      type: verification.type,
      status: verification.status,
      verifiedAt: verification.verifiedAt,
      createdAt: verification.createdAt,
      updatedAt: DateTime.now(),
      documentPath: 'mock/$fileName',
    );
    final index = _documentVerifications.indexWhere(
      (v) => v.id == verification.id,
    );
    if (index != -1) _documentVerifications[index] = updated;
    return updated;
  }

  @override
  Future<Provider> apply({
    required Category category,
    required String specializationName,
    required int yearsOfExperience,
    String? previousCompany,
    required bool isIndependent,
    required String biography,
  }) async {
    final now = DateTime.now();
    return Provider(
      id: ProviderId.create(),
      identityId: _identityId,
      providerProfileId: ProfileId.create(),
      status: ProviderStatus.pending,
      type: isIndependent ? ProviderType.independent : ProviderType.company,
      experience: _experienceFor(yearsOfExperience),
      biography: biography,
      yearsOfExperience: yearsOfExperience,
      createdAt: now,
      updatedAt: now,
    );
  }

  @override
  Future<Verification> resetVerificationStatus(Verification verification) async {
    final updated = Verification(
      id: verification.id,
      identityId: verification.identityId,
      type: verification.type,
      status: VerificationStatus.pending,
      verifiedAt: verification.verifiedAt,
      createdAt: verification.createdAt,
      updatedAt: DateTime.now(),
      documentPath: verification.documentPath,
    );
    final index = _documentVerifications.indexWhere(
      (v) => v.id == verification.id,
    );
    if (index != -1) _documentVerifications[index] = updated;
    return updated;
  }

  @override
  Future<Provider> resetProviderStatus(Provider provider) async {
    return Provider(
      id: provider.id,
      identityId: provider.identityId,
      providerProfileId: provider.providerProfileId,
      status: ProviderStatus.pending,
      type: provider.type,
      experience: provider.experience,
      biography: provider.biography,
      yearsOfExperience: provider.yearsOfExperience,
      createdAt: provider.createdAt,
      updatedAt: DateTime.now(),
    );
  }
}
