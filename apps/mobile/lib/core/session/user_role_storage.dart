import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'user_role.dart';

/// Persists the "cliente"/"prestador de servicios" role switch (see
/// `UserRoleController`) across app restarts. Reuses
/// `flutter_secure_storage`, same as `ThemeModeStorage`.
class UserRoleStorage {
  UserRoleStorage({FlutterSecureStorage? storage})
    : _storage = storage ?? const FlutterSecureStorage();

  final FlutterSecureStorage _storage;

  static const _key = 'ui.user_role';

  Future<UserRole> read() async {
    final value = await _storage.read(key: _key);
    return value == 'provider' ? UserRole.provider : UserRole.client;
  }

  Future<void> save(UserRole role) => _storage.write(
    key: _key,
    value: role == UserRole.provider ? 'provider' : 'client',
  );
}
