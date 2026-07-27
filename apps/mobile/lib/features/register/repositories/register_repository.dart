import '../../../identity/models/document_type.dart';

/// Contract for creating a real account: `Identity` + `Credential`
/// (password) + `Authentication` (password method) — the three
/// backend records `LoginUseCase` requires to exist before a
/// documentNumber/password pair can ever log in. Implemented by
/// `MockRegisterRepository` (no-op, offline demo mode) and
/// `HttpRegisterRepository` (the real backend calls).
abstract class RegisterRepository {
  Future<void> register({
    required String fullName,
    required DocumentType documentType,
    required String documentNumber,
    required DateTime birthDate,
    required String password,
  });
}
