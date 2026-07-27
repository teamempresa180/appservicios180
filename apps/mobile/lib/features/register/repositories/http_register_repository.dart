import '../../../core/network/api_client.dart';
import '../../../core/network/mappers/enum_json.dart';
import '../../../identity/models/document_type.dart';
import 'register_repository.dart';

/// [RegisterRepository] backed by [ApiClient] — creates a real account
/// via three sequential, unauthenticated backend calls (in this exact
/// order, each depending on the previous one's id):
///
/// 1. `POST /identities` — creates the `Identity`, returns its id.
/// 2. `POST /credentials` (`type: PASSWORD`) — hashes and stores the
///    password.
/// 3. `POST /authentications` (`methodType: PASSWORD`) — the "this
///    Identity may log in with a password" record `LoginUseCase`
///    requires. This endpoint is deliberately public for exactly this
///    step (see `AuthenticationController.create`'s doc comment) —
///    without it self-registration would be impossible, since
///    `LoginUseCase` refuses to even check the password unless an
///    *active* `Password` `Authentication` record already exists.
///
/// Does not log the new user in — `RegisterPage` calls
/// `SessionManager.login` itself right after this succeeds.
class HttpRegisterRepository implements RegisterRepository {
  HttpRegisterRepository(this._apiClient);

  final ApiClient _apiClient;

  @override
  Future<void> register({
    required String fullName,
    required DocumentType documentType,
    required String documentNumber,
    required DateTime birthDate,
    required String password,
  }) async {
    final identityJson = await _apiClient.post(
      '/identities',
      data: {
        'fullName': fullName,
        'documentType': enumToJson(documentType.name),
        'documentNumber': documentNumber,
        'birthDate': birthDate.toIso8601String(),
      },
    );
    final identityId = identityJson['id'] as String;

    await _apiClient.post(
      '/credentials',
      data: {
        'identityId': identityId,
        'type': 'PASSWORD',
        'password': password,
      },
    );

    await _apiClient.post(
      '/authentications',
      data: {'identityId': identityId, 'methodType': 'PASSWORD'},
    );
  }
}
