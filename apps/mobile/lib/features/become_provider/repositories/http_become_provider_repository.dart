import 'package:dio/dio.dart';

import '../../../category/entities/category.dart';
import '../../../core/network/api_client.dart';
import '../../../core/network/mappers/domain_http_mappers.dart';
import '../../../core/network/mappers/enum_json.dart';
import '../../../core/session/session_manager.dart';
import '../../../identity/entities/identity.dart';
import '../../../profiles/entities/profile.dart';
import '../../../provider/models/provider_experience.dart';
import '../../../verification/entities/verification.dart';
import '../../../verification/models/verification_type.dart';
import '../../categories/repositories/category_repository.dart';
import '../models/provider_application.dart';
import 'become_provider_repository.dart';

/// [BecomeProviderRepository] backed by [ApiClient].
///
/// `Provider` now has dedicated `categoryId`/`specialization` columns
/// on the backend (see `apps/backend` migration
/// `provider_category_and_review_states`), so both are sent as real
/// fields on `POST /providers` instead of being folded into
/// `biography` as a text prefix (the previous, interim approach).
///
/// - `city`/`department`/`coverage` still become a real `Address`
///   (`type: SERVICE`) for the identity, reusing the existing Address
///   module rather than inventing a new "coverage area" concept.
///
/// `type` (independent/freelancer/company) isn't asked in this form —
/// defaults to `independent`. `experience` (the qualitative level
/// `Provider` requires) is derived from `yearsOfExperience` via a
/// simple threshold, since asking for both a level *and* years would
/// be redundant.
///
/// The created `Provider` starts in `ProviderStatus.pending` — set by
/// the backend's `CreateProviderUseCase`, not this repository — until
/// both uploaded documents are reviewed and approved (today: manually,
/// via the existing `PUT /providers/:id` endpoint — there is no
/// admin/staff role model in this backend yet).
class HttpBecomeProviderRepository implements BecomeProviderRepository {
  HttpBecomeProviderRepository(
    this._apiClient,
    this._sessionManager,
    this._categoryRepository,
  );

  final ApiClient _apiClient;
  final SessionManager _sessionManager;
  final CategoryRepository _categoryRepository;

  String get _identityId => _sessionManager.currentUserId!;

  @override
  Future<List<Category>> getCategories() => _categoryRepository.getAll();

  ProviderExperience _experienceFor(int years) {
    if (years < 2) return ProviderExperience.beginner;
    if (years < 5) return ProviderExperience.intermediate;
    if (years < 10) return ProviderExperience.advanced;
    return ProviderExperience.expert;
  }

  Future<Identity> _fetchIdentity() async {
    final json = await _apiClient.get('/identities/$_identityId');
    return IdentityHttpMapper.fromJson(json);
  }

  /// The account may not have a `Profile` yet — real registration only
  /// creates `Identity`/`Credential`/`Authentication` (see
  /// `HttpRegisterRepository`), and `Provider` requires a
  /// `providerProfileId`. Same create-if-missing shape as
  /// `HttpProfileRepository.updateAddress`.
  Future<Profile> _ensureProfile(String fullName) async {
    final json = await _apiClient.get('/profiles');
    final items = (json['items'] as List<dynamic>).cast<Map<String, dynamic>>();
    final match = items.where((item) => item['identityId'] == _identityId);
    if (match.isNotEmpty) return ProfileHttpMapper.fromJson(match.first);
    final created = await _apiClient.post(
      '/profiles',
      data: {
        'identityId': _identityId,
        'displayName': fullName,
        'visibility': 'PUBLIC',
      },
    );
    return ProfileHttpMapper.fromJson(created);
  }

  Future<void> _saveCoverageAddress({
    required String city,
    required String department,
    required String coverage,
  }) async {
    final json = await _apiClient.get('/addresses');
    final items = (json['items'] as List<dynamic>).cast<Map<String, dynamic>>();
    final match = items.where(
      (item) => item['identityId'] == _identityId && item['type'] == 'SERVICE',
    );
    if (match.isNotEmpty) {
      await _apiClient.put(
        '/addresses/${match.first['id']}',
        data: {'alias': 'Zona de cobertura', 'fullAddress': coverage},
      );
      return;
    }
    await _apiClient.post(
      '/addresses',
      data: {
        'identityId': _identityId,
        'alias': 'Zona de cobertura',
        'fullAddress': coverage,
        'city': city,
        'state': department,
        'country': 'Colombia',
        'postalCode': '—',
        'type': 'SERVICE',
      },
    );
  }

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
    final identity = await _fetchIdentity();
    final profile = await _ensureProfile(identity.fullName);
    await _saveCoverageAddress(
      city: city,
      department: department,
      coverage: coverage,
    );

    final providerJson = await _apiClient.post(
      '/providers',
      data: {
        'identityId': _identityId,
        'providerProfileId': profile.id.value,
        'type': 'INDEPENDENT',
        'experience': enumToJson(_experienceFor(yearsOfExperience).name),
        'biography': biography,
        'yearsOfExperience': yearsOfExperience,
        'categoryId': category.id.value,
        'specialization': specialization,
      },
    );
    final provider = ProviderHttpMapper.fromJson(providerJson);

    Future<Verification> createVerification(VerificationType type) async {
      final json = await _apiClient.post(
        '/verifications',
        data: {'identityId': _identityId, 'type': enumToJson(type.name)},
      );
      return VerificationHttpMapper.fromJson(json);
    }

    final criminalRecordVerification = await createVerification(
      VerificationType.criminalRecord,
    );
    final certificationVerification = await createVerification(
      VerificationType.certification,
    );

    return ProviderApplication(
      provider: provider,
      criminalRecordVerification: criminalRecordVerification,
      certificationVerification: certificationVerification,
    );
  }

  @override
  Future<Verification> uploadDocument({
    required Verification verification,
    required List<int> fileBytes,
    required String fileName,
    void Function(double progress)? onProgress,
  }) async {
    final formData = FormData.fromMap({
      'file': MultipartFile.fromBytes(fileBytes, filename: fileName),
    });
    final json = await _apiClient.post(
      '/verifications/${verification.id.value}/document',
      data: formData,
      onSendProgress: (sent, total) {
        if (total > 0) onProgress?.call(sent / total);
      },
    );
    return VerificationHttpMapper.fromJson(json);
  }
}
