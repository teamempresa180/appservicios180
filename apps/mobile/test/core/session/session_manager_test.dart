import 'package:flutter_test/flutter_test.dart';
import 'package:mobile/core/network/http_exceptions.dart';
import 'package:mobile/core/session/auth_repository.dart';
import 'package:mobile/core/session/auth_tokens.dart';
import 'package:mobile/core/session/session_manager.dart';
import 'package:mobile/core/storage/secure_token_storage.dart';

/// In-memory [SecureTokenStorage] — subclassed rather than mocked so the
/// test exercises the real `SessionManager` against the real type it
/// depends on, without touching the platform keystore.
class _FakeTokenStorage extends SecureTokenStorage {
  String? access;
  String? refresh;

  @override
  Future<void> save({
    required String accessToken,
    required String refreshToken,
  }) async {
    access = accessToken;
    refresh = refreshToken;
  }

  @override
  Future<String?> readAccessToken() async => access;

  @override
  Future<String?> readRefreshToken() async => refresh;

  @override
  Future<void> clear() async {
    access = null;
    refresh = null;
  }
}

class _FakeAuthRepository implements AuthRepository {
  Object? meError;
  Object? logoutError;
  int logoutCalls = 0;

  @override
  Future<AuthTokens> login({
    required String documentNumber,
    required String password,
  }) async => const AuthTokens(
    accessToken: 'access-1',
    refreshToken: 'refresh-1',
    role: 'CUSTOMER',
  );

  @override
  Future<AuthTokens> refresh(String refreshToken) async => const AuthTokens(
    accessToken: 'access-2',
    refreshToken: 'refresh-2',
    role: 'CUSTOMER',
  );

  @override
  Future<void> logout(String refreshToken) async {
    logoutCalls++;
    if (logoutError != null) throw logoutError!;
  }

  @override
  Future<CurrentUser> me() async {
    if (meError != null) throw meError!;
    return const CurrentUser(id: 'user-1', role: 'CUSTOMER');
  }
}

void main() {
  late _FakeAuthRepository repository;
  late _FakeTokenStorage storage;
  late SessionManager sessionManager;

  setUp(() {
    repository = _FakeAuthRepository();
    storage = _FakeTokenStorage();
    sessionManager = SessionManager(
      authRepository: repository,
      tokenStorage: storage,
    );
  });

  group('login', () {
    test('authenticates and persists both tokens on success', () async {
      await sessionManager.login(documentNumber: '123', password: 'pw');

      expect(sessionManager.isAuthenticated, isTrue);
      expect(sessionManager.currentUserId, 'user-1');
      expect(storage.access, 'access-1');
      expect(storage.refresh, 'refresh-1');
    });

    test('rolls the whole login back when the me() call fails', () async {
      // Regression: tokens were written to secure storage before `me()`
      // ran, so a failure here left a half-logged-in device — the login
      // screen reported an error while the next cold start silently
      // restored a session the user was told they never got.
      repository.meError = const NetworkHttpException('offline');

      await expectLater(
        sessionManager.login(documentNumber: '123', password: 'pw'),
        throwsA(isA<HttpException>()),
      );

      expect(sessionManager.isAuthenticated, isFalse);
      expect(sessionManager.accessToken, isNull);
      expect(storage.access, isNull, reason: 'persisted tokens must be wiped');
      expect(storage.refresh, isNull);
    });
  });

  group('logout', () {
    test('clears the local session on success', () async {
      await sessionManager.login(documentNumber: '123', password: 'pw');
      await sessionManager.logout();

      expect(repository.logoutCalls, 1);
      expect(sessionManager.isAuthenticated, isFalse);
      expect(storage.access, isNull);
    });

    test('still clears the local session when the backend call fails', () async {
      // "Log me out" is unconditional — offline, 500, anything.
      await sessionManager.login(documentNumber: '123', password: 'pw');
      repository.logoutError = const NetworkHttpException('offline');

      await sessionManager.logout();

      expect(sessionManager.isAuthenticated, isFalse);
      expect(storage.refresh, isNull);
    });

    test('still clears the local session on a non-HttpException error', () async {
      // Regression: `logout` caught only `HttpException`, so any other
      // throw escaped before `_clear()` and left the user logged in with
      // no feedback at all. The real trigger was a `TypeError` from
      // casting the logout endpoint's empty response body to a Map.
      await sessionManager.login(documentNumber: '123', password: 'pw');
      repository.logoutError = TypeError();

      await sessionManager.logout();

      expect(sessionManager.isAuthenticated, isFalse);
      expect(storage.access, isNull);
      expect(storage.refresh, isNull);
    });
  });

  group('canActAsProvider', () {
    test('is false for a customer session', () async {
      await sessionManager.login(documentNumber: '123', password: 'pw');
      expect(sessionManager.canActAsProvider, isFalse);
    });

    test('follows the role the backend returned', () async {
      await sessionManager.login(documentNumber: '123', password: 'pw');
      await sessionManager.onTokensRefreshed(
        accessToken: 'access-2',
        refreshToken: 'refresh-2',
        role: 'PROVIDER',
      );

      expect(sessionManager.canActAsProvider, isTrue);
    });

    test('keeps the previous role when a refresh omits it', () async {
      await sessionManager.login(documentNumber: '123', password: 'pw');
      await sessionManager.onTokensRefreshed(
        accessToken: 'access-2',
        refreshToken: 'refresh-2',
      );

      expect(sessionManager.currentRole, 'CUSTOMER');
    });
  });

  group('session expiry', () {
    test('flags an involuntary expiry exactly once', () async {
      await sessionManager.login(documentNumber: '123', password: 'pw');
      await sessionManager.onSessionExpired();

      expect(sessionManager.isAuthenticated, isFalse);
      expect(sessionManager.consumeSessionExpired(), isTrue);
      expect(
        sessionManager.consumeSessionExpired(),
        isFalse,
        reason: 'reading the flag consumes it',
      );
    });

    test('a manual logout is not reported as an expiry', () async {
      await sessionManager.login(documentNumber: '123', password: 'pw');
      await sessionManager.logout();

      expect(sessionManager.consumeSessionExpired(), isFalse);
    });
  });
}
