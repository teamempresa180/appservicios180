/// Mirrors the backend's `AuthTokensResponseDto` — the plain data result
/// of a successful login/refresh.
class AuthTokens {
  const AuthTokens({
    required this.accessToken,
    required this.refreshToken,
    required this.role,
  });

  factory AuthTokens.fromJson(Map<String, dynamic> json) => AuthTokens(
    accessToken: json['accessToken'] as String,
    refreshToken: json['refreshToken'] as String,
    role: json['role'] as String,
  );

  final String accessToken;
  final String refreshToken;

  /// `"CUSTOMER"` or `"PROVIDER"` — verbatim from the backend's `Role` enum.
  final String role;
}

/// Mirrors the backend's `CurrentUserResponseDto` (`GET /authentications/me`).
class CurrentUser {
  const CurrentUser({required this.id, required this.role});

  factory CurrentUser.fromJson(Map<String, dynamic> json) => CurrentUser(
    id: json['id'] as String,
    role: json['role'] as String,
  );

  final String id;
  final String role;
}
