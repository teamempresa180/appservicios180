/// Plain data captured by the Login form once local validation passes.
/// No behavior — this is the shape that will eventually be handed to the
/// Authentication Application layer (see the feature README).
class LoginCredentials {
  const LoginCredentials({required this.email, required this.password});

  final String email;
  final String password;
}
