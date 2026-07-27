import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

/// Persists the user's chosen [ThemeMode] (light/dark only — this app
/// has no "follow system" option) across app restarts. Reuses
/// `flutter_secure_storage` (already a dependency for the auth tokens)
/// instead of adding a new local-storage package for a single value.
class ThemeModeStorage {
  ThemeModeStorage({FlutterSecureStorage? storage})
    : _storage = storage ?? const FlutterSecureStorage();

  final FlutterSecureStorage _storage;

  static const _key = 'ui.theme_mode';

  Future<ThemeMode> read() async {
    final value = await _storage.read(key: _key);
    return value == 'dark' ? ThemeMode.dark : ThemeMode.light;
  }

  Future<void> save(ThemeMode mode) =>
      _storage.write(key: _key, value: mode == ThemeMode.dark ? 'dark' : 'light');
}
