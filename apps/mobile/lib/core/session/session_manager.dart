import 'package:flutter/foundation.dart';
import '../network/http_exceptions.dart';
import '../network/token_provider.dart';
import '../storage/secure_token_storage.dart';
import 'auth_repository.dart';
import 'auth_tokens.dart';

/// Single source of truth for "is anyone logged in, and as whom" —
/// implements [TokenProvider] so the network layer can read/refresh
/// tokens without depending on this class's full API. A
/// [ChangeNotifier] so the navigation guard and any widget that cares
/// (e.g. a profile menu showing the current role) can react to
/// login/logout/session-expiry without polling.
///
/// Owns the only [AuthRepository] call sites in the app — pages call
/// [login]/[logout], never the repository directly.
class SessionManager extends ChangeNotifier implements TokenProvider {
  SessionManager({
    required AuthRepository authRepository,
    required SecureTokenStorage tokenStorage,
  }) : _authRepository = authRepository,
       _tokenStorage = tokenStorage;

  final AuthRepository _authRepository;
  final SecureTokenStorage _tokenStorage;

  String? _accessToken;
  String? _refreshToken;
  String? _currentUserId;
  String? _currentRole;
  bool _isRestoring = true;
  bool _sessionExpired = false;

  @override
  String? get accessToken => _accessToken;

  @override
  String? get refreshToken => _refreshToken;

  String? get currentUserId => _currentUserId;

  String? get currentRole => _currentRole;

  /// `true` while [restore] hasn't finished — the navigation guard
  /// treats this as "stay on splash", never as "not authenticated".
  bool get isRestoring => _isRestoring;

  bool get isAuthenticated => _accessToken != null && _currentUserId != null;

  /// Reads and clears the "the session was cleared involuntarily"
  /// flag (an expired/invalid refresh token — [onSessionExpired],
  /// never a manual [logout]). One-shot by design: `LoginPage` calls
  /// this once when it builds after the `AppRouteGuard` redirect and
  /// shows an explanatory message iff it was `true` — a plain
  /// "session expired" toast on every subsequent visit to Login would
  /// be wrong, so reading it also consumes it.
  bool consumeSessionExpired() {
    final value = _sessionExpired;
    _sessionExpired = false;
    return value;
  }

  /// Reads any persisted tokens at app start and, if present, confirms
  /// they still identify a real session via `GET /authentications/me`
  /// (which transparently benefits from [RefreshInterceptor] if the
  /// access token alone has expired but the refresh token hasn't).
  /// Called once, before the router picks an initial route.
  Future<void> restore() async {
    // Every failure mode here — a corrupted secure-storage entry after
    // a reinstall, a network error that isn't an `HttpException` for
    // some unforeseen reason, anything — must still end with
    // `_isRestoring = false` and a listener notification. Splash has no
    // fallback timeout of its own: if this method throws anything
    // uncaught, the app is stuck on "Inicializando..." forever, which
    // is exactly what a real device hit after a fresh reinstall.
    try {
      final storedAccess = await _tokenStorage.readAccessToken();
      final storedRefresh = await _tokenStorage.readRefreshToken();
      if (storedAccess == null || storedRefresh == null) {
        return;
      }

      _accessToken = storedAccess;
      _refreshToken = storedRefresh;
      try {
        final user = await _authRepository.me();
        _currentUserId = user.id;
        _currentRole = user.role;
      } on HttpException {
        await _clear();
      }
    } catch (_) {
      await _clear();
    } finally {
      _isRestoring = false;
      notifyListeners();
    }
  }

  Future<void> login({
    required String documentNumber,
    required String password,
  }) async {
    final tokens = await _authRepository.login(
      documentNumber: documentNumber,
      password: password,
    );
    await _applyTokens(tokens);
    final user = await _authRepository.me();
    _currentUserId = user.id;
    _currentRole = user.role;
    notifyListeners();
  }

  Future<void> logout() async {
    final token = _refreshToken;
    if (token != null) {
      // Best-effort: the local session ends regardless of whether the
      // backend call succeeds (e.g. offline logout still logs out
      // locally — the refresh token simply stays valid server-side
      // until it naturally expires).
      try {
        await _authRepository.logout(token);
      } on HttpException {
        // Ignored — see comment above.
      }
    }
    await _clear();
    notifyListeners();
  }

  @override
  Future<void> onTokensRefreshed({
    required String accessToken,
    required String refreshToken,
  }) async {
    await _applyTokens(
      AuthTokens(
        accessToken: accessToken,
        refreshToken: refreshToken,
        role: _currentRole ?? '',
      ),
    );
  }

  @override
  Future<void> onSessionExpired() async {
    // Only set when there was actually a session to lose — checked via
    // the refresh token rather than [isAuthenticated] because this can
    // fire mid-`restore()`, before `_currentUserId` is ever set (the
    // access/refresh tokens are applied first, `GET
    // /authentications/me` confirms them after). An app that never had
    // a persisted session at all (fresh install) never reaches here
    // with a null refresh token in the first place — see
    // `RefreshInterceptor._refresh`'s own null check.
    if (_refreshToken != null) _sessionExpired = true;
    await _clear();
    notifyListeners();
  }

  Future<void> _applyTokens(AuthTokens tokens) async {
    _accessToken = tokens.accessToken;
    _refreshToken = tokens.refreshToken;
    _currentRole = tokens.role;
    await _tokenStorage.save(
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    );
  }

  Future<void> _clear() async {
    _accessToken = null;
    _refreshToken = null;
    _currentUserId = null;
    _currentRole = null;
    await _tokenStorage.clear();
  }
}
