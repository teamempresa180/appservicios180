import 'package:flutter/material.dart';
import 'theme_mode_storage.dart';

/// Single source of truth for light/dark mode — a [ChangeNotifier] so
/// `AppServiciosApp` can rebuild `MaterialApp.router` whenever it
/// changes, and [SettingsPage] can offer a toggle without prop-drilling.
/// Defaults to light until [load] resolves the persisted value.
class ThemeModeController extends ChangeNotifier {
  ThemeModeController({required ThemeModeStorage storage})
    : _storage = storage;

  final ThemeModeStorage _storage;

  ThemeMode _mode = ThemeMode.light;
  ThemeMode get mode => _mode;
  bool get isDark => _mode == ThemeMode.dark;

  Future<void> load() async {
    _mode = await _storage.read();
    notifyListeners();
  }

  Future<void> toggle() => setMode(isDark ? ThemeMode.light : ThemeMode.dark);

  Future<void> setMode(ThemeMode mode) async {
    if (_mode == mode) return;
    _mode = mode;
    notifyListeners();
    await _storage.save(mode);
  }
}
