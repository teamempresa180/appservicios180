import 'package:dio/dio.dart';

import '../../../category/entities/category.dart';
import '../../../core/network/api_client.dart';
import '../../../core/network/mappers/domain_http_mappers.dart';
import '../../../core/network/mappers/enum_json.dart';
import '../../../core/session/session_manager.dart';
import '../../../identity/entities/identity.dart';
import '../../../profiles/entities/profile.dart';
import '../../../provider/entities/provider.dart';
import '../../../provider/models/provider_experience.dart';
import '../../../verification/entities/verification.dart';
import '../../../verification/models/verification_type.dart';
import '../../categories/repositories/category_repository.dart';
import '../models/required_provider_documents.dart';
import 'become_provider_repository.dart';

/// [BecomeProviderRepository] backed by [ApiClient].
///
/// `Provider` has dedicated `categoryId`/`specialization` columns on
/// the backend (see `apps/backend` migration
/// `provider_category_and_review_states`), sent as real fields on
/// `POST /providers`. `specialization` is sent as the chosen
/// specialization's display name (see `SpecializationPicker`) under
/// the same field name the backend already accepts — a parallel
/// backend effort is replacing that column with `specializationId`;
/// this call site is the natural, self-contained place to switch the
/// field once that lands (see Prompt 13's notes), not something this
/// repository needs to guess at today.
///
/// Photo, address and phone are handled entirely by `ProfileRepository`
/// / `AddressManagementRepository` / `ContactManagementRepository` in
/// Paso 1 — this repository never touches `/addresses` or `/contacts`.
///
/// `type` is independent/company based on the applicant's own toggle
/// (Paso 3, "¿independiente?"). `experience` (the qualitative level
/// `Provider` requires) is derived from `yearsOfExperience` via a
/// simple threshold, since asking for both a level *and* years would
/// be redundant.
///
/// The created `Provider` starts in `ProviderStatus.pending` — set by
/// the backend's `CreateProviderUseCase`, not this repository — until
/// the uploaded documents are reviewed and approved (today: manually,
/// via the existing `PUT /providers/:id` endpoint — there is no
/// admin/staff role model in this backend yet).
///
/// [ensureDocumentVerifications] has one known limitation: `GET
/// /verifications` has no `?identityId=` query filter on the backend
/// (same interim shape as `HttpOrdersRepository.getQuoteFor`), so it
/// lists a page and matches `identityId`/`type` client-side. If an
/// identity ever has more verifications than fit on one page, an
/// already-created record could be missed and a duplicate created —
/// harmless (the applicant just re-uploads against the new one) but
/// worth a real `?identityId=` filter as a follow-up, same as the
/// other Http repositories with this shape.
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
  Future<Provider?> getExistingApplication() async {
    final json = await _apiClient.get('/providers');
    final items = (json['items'] as List<dynamic>).cast<Map<String, dynamic>>();
    final match = items.where((item) => item['identityId'] == _identityId);
    if (match.isEmpty) return null;
    return ProviderHttpMapper.fromJson(match.first);
  }

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

  @override
  Future<List<Verification>> ensureDocumentVerifications() async {
    final json = await _apiClient.get(
      '/verifications',
      queryParameters: {'pageSize': 200},
    );
    final items = (json['items'] as List<dynamic>).cast<Map<String, dynamic>>();
    final existingByType = <VerificationType, Map<String, dynamic>>{
      for (final item in items)
        if (item['identityId'] == _identityId)
          VerificationType.values.byName(
            enumFromJson(item['type'] as String),
          ): item,
    };

    final result = <Verification>[];
    for (final type in requiredProviderDocuments) {
      final existing = existingByType[type];
      if (existing != null) {
        result.add(VerificationHttpMapper.fromJson(existing));
        continue;
      }
      final created = await _apiClient.post(
        '/verifications',
        data: {'identityId': _identityId, 'type': enumToJson(type.name)},
      );
      result.add(VerificationHttpMapper.fromJson(created));
    }
    return result;
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

  @override
  Future<Provider> apply({
    required Category category,
    required String specializationName,
    required int yearsOfExperience,
    String? previousCompany,
    required bool isIndependent,
    required String biography,
  }) async {
    final identity = await _fetchIdentity();
    final profile = await _ensureProfile(identity.fullName);

    // `Provider` has no dedicated "previous company" column (unlike
    // `categoryId`/`specialization`, which do) — same honest,
    // no-silent-drop approach the old doc comment on this method used
    // to describe for category/specialization before those got real
    // columns: fold it into `biography` as a labeled line rather than
    // inventing a field or discarding what the applicant typed. Worth
    // a real column as a backend follow-up.
    final effectiveBiography = (previousCompany == null || previousCompany.isEmpty)
        ? biography
        : '$biography\n\nEmpresa anterior: $previousCompany';

    final providerJson = await _apiClient.post(
      '/providers',
      data: {
        'identityId': _identityId,
        'providerProfileId': profile.id.value,
        'type': isIndependent ? 'INDEPENDENT' : 'COMPANY',
        'experience': enumToJson(_experienceFor(yearsOfExperience).name),
        'biography': effectiveBiography,
        'yearsOfExperience': yearsOfExperience,
        'categoryId': category.id.value,
        'specialization': specializationName,
      },
    );
    return ProviderHttpMapper.fromJson(providerJson);
  }

  @override
  Future<Verification> resetVerificationStatus(Verification verification) async {
    final json = await _apiClient.put(
      '/verifications/${verification.id.value}',
      data: {'status': 'PENDING'},
    );
    return VerificationHttpMapper.fromJson(json);
  }

  @override
  Future<Provider> resetProviderStatus(Provider provider) async {
    final json = await _apiClient.put(
      '/providers/${provider.id.value}',
      data: {'status': 'PENDING'},
    );
    return ProviderHttpMapper.fromJson(json);
  }
}
