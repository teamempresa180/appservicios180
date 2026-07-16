import 'package:flutter_secure_storage/flutter_secure_storage.dart';

/// Encrypted at-rest storage for the access/refresh token pair —
/// the only place in the app that touches [FlutterSecureStorage]
/// directly. [SessionManager] is the only consumer.
class SecureTokenStorage {
  SecureTokenStorage({FlutterSecureStorage? storage})
    : _storage = storage ?? const FlutterSecureStorage();

  final FlutterSecureStorage _storage;

  static const _accessTokenKey = 'auth.access_token';
  static const _refreshTokenKey = 'auth.refresh_token';

  Future<void> save({
    required String accessToken,
    required String refreshToken,
  }) async {
    await _storage.write(key: _accessTokenKey, value: accessToken);
    await _storage.write(key: _refreshTokenKey, value: refreshToken);
  }

  Future<String?> readAccessToken() => _storage.read(key: _accessTokenKey);

  Future<String?> readRefreshToken() => _storage.read(key: _refreshTokenKey);

  Future<void> clear() async {
    await _storage.delete(key: _accessTokenKey);
    await _storage.delete(key: _refreshTokenKey);
  }
}
