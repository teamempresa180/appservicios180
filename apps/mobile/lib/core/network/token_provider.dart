/// What the network layer needs from session state, without depending on
/// [SessionManager] directly (that would create `network` → `session` →
/// `network` import cycle, since the session layer needs [ApiClient] to
/// call the backend). [SessionManager] implements this interface instead.
abstract class TokenProvider {
  String? get accessToken;
  String? get refreshToken;

  /// Called by [RefreshInterceptor] after it successfully exchanges the
  /// refresh token for a new pair — persists the new tokens.
  ///
  /// [role] is the role the backend recomputed while issuing the pair
  /// (`RefreshUseCase` re-derives it from the current Provider record
  /// rather than copying the old token's claim, precisely so it can
  /// change mid-session). Nullable only because a response without the
  /// field should keep the previously known role rather than blank it.
  Future<void> onTokensRefreshed({
    required String accessToken,
    required String refreshToken,
    String? role,
  });

  /// Called when the refresh token itself is rejected (expired/revoked) —
  /// the session is over; the app must return to the login screen.
  Future<void> onSessionExpired();
}

/// Breaks the construction-order cycle between [ApiClient] (needs a
/// [TokenProvider]) and `SessionManager` (needs [ApiClient], via
/// `AuthRepository`, to do the login/refresh HTTP calls itself).
/// `service_locator.dart` constructs this first, builds [ApiClient]
/// against it, then attaches the real `SessionManager` once it exists.
class TokenProviderHolder implements TokenProvider {
  TokenProvider? _delegate;

  void attach(TokenProvider delegate) {
    _delegate = delegate;
  }

  TokenProvider get _requireDelegate {
    final delegate = _delegate;
    assert(delegate != null, 'TokenProviderHolder used before attach()');
    return delegate!;
  }

  @override
  String? get accessToken => _delegate?.accessToken;

  @override
  String? get refreshToken => _delegate?.refreshToken;

  @override
  Future<void> onTokensRefreshed({
    required String accessToken,
    required String refreshToken,
    String? role,
  }) => _requireDelegate.onTokensRefreshed(
    accessToken: accessToken,
    refreshToken: refreshToken,
    role: role,
  );

  @override
  Future<void> onSessionExpired() => _requireDelegate.onSessionExpired();
}
