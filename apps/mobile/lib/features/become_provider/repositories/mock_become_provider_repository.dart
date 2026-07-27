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
import '../../../verification/models/verification_type.dart';
import '../../categories/repositories/category_repository.dart';
import '../models/provider_application.dart';
import 'become_provider_repository.dart';

/// In-memory `BecomeProviderRepository` — no backend, no persistence,
/// no network. Delegates category reads to the injected
/// [CategoryRepository] rather than keeping its own mock list.
class MockBecomeProviderRepository implements BecomeProviderRepository {
  MockBecomeProviderRepository(this._categoryRepository);

  final CategoryRepository _categoryRepository;

  @override
  Future<List<Category>> getCategories() => _categoryRepository.getAll();

  @override
  Future<ProviderApplication> apply({
    required Category category,
    required String specialization,
    required int yearsOfExperience,
    required String biography,
    required String city,
    required String department,
    required String coverage,
  }) async {
    final now = DateTime.now();
    final identityId = IdentityId.fromString('become-provider-mock-identity');
    final provider = Provider(
      id: ProviderId.create(),
      identityId: identityId,
      providerProfileId: ProfileId.create(),
      status: ProviderStatus.pending,
      type: ProviderType.independent,
      experience: ProviderExperience.intermediate,
      biography: biography,
      yearsOfExperience: yearsOfExperience,
      createdAt: now,
      updatedAt: now,
    );
    Verification verificationOf(VerificationType type) => Verification(
      id: VerificationId.create(),
      identityId: identityId,
      type: type,
      status: VerificationStatus.pending,
      verifiedAt: null,
      createdAt: now,
      updatedAt: now,
    );
    return ProviderApplication(
      provider: provider,
      criminalRecordVerification: verificationOf(
        VerificationType.criminalRecord,
      ),
      certificationVerification: verificationOf(VerificationType.certification),
    );
  }

  @override
  Future<Verification> uploadDocument({
    required Verification verification,
    required List<int> fileBytes,
    required String fileName,
    void Function(double progress)? onProgress,
  }) async {
    onProgress?.call(1);
    return Verification(
      id: verification.id,
      identityId: verification.identityId,
      type: verification.type,
      status: verification.status,
      verifiedAt: verification.verifiedAt,
      createdAt: verification.createdAt,
      updatedAt: DateTime.now(),
      documentPath: 'mock/$fileName',
    );
  }
}
