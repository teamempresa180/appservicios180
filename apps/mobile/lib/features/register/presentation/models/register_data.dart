/// Plain data captured by the Register form once local validation passes.
/// No behavior — this is the shape that will eventually be handed to the
/// Identity/Credentials/Authentication Application layer (see the feature
/// README).
class RegisterData {
  const RegisterData({
    required this.fullName,
    required this.email,
    required this.password,
  });

  final String fullName;
  final String email;
  final String password;
}
