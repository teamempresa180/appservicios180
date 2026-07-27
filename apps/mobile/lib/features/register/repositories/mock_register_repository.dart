import '../../../identity/models/document_type.dart';
import 'register_repository.dart';

/// No-op `RegisterRepository` for offline demo mode — there is no real
/// backend to create an account against, so this simply succeeds
/// without persisting anything. See `HttpRegisterRepository` for the
/// real implementation.
class MockRegisterRepository implements RegisterRepository {
  @override
  Future<void> register({
    required String fullName,
    required DocumentType documentType,
    required String documentNumber,
    required DateTime birthDate,
    required String password,
  }) async {}
}
