import 'package:flutter_secure_storage/flutter_secure_storage.dart';

/// Persists the provider's "Disponible"/"Ocupado" toggle (see
/// `ProviderAvailabilityController`) across app restarts. Reuses
/// `flutter_secure_storage`, same as `UserRoleStorage`/`ThemeModeStorage`.
class ProviderAvailabilityStorage {
  ProviderAvailabilityStorage({FlutterSecureStorage? storage})
    : _storage = storage ?? const FlutterSecureStorage();

  final FlutterSecureStorage _storage;

  static const _key = 'ui.provider_availability';

  Future<bool> read() async {
    final value = await _storage.read(key: _key);
    return value != 'busy';
  }

  Future<void> save(bool isAvailable) =>
      _storage.write(key: _key, value: isAvailable ? 'available' : 'busy');
}
