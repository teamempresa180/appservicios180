/// Plain data captured by the Login form once local validation passes.
/// No behavior — this is the shape handed to `SessionManager.login`,
/// which sends [documentNumber] straight through as the backend's
/// `documentNumber` login identifier.
class LoginCredentials {
  const LoginCredentials({
    required this.documentNumber,
    required this.password,
  });

  final String documentNumber;
  final String password;
}
