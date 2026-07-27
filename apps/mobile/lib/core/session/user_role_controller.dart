import 'package:flutter/foundation.dart';
import 'user_role.dart';
import 'user_role_storage.dart';

/// Single source of truth for which role the session is currently
/// acting as (Cliente vs. Prestador de servicios) — switched from the
/// App Shell's side drawer (InDrive-style "cambiar a conductor"
/// pattern). A [ChangeNotifier] so `HomePage` can rebuild with the
/// right layout the moment it changes. Defaults to Cliente until
/// [load] resolves the persisted value.
class UserRoleController extends ChangeNotifier {
  UserRoleController({required UserRoleStorage storage}) : _storage = storage;

  final UserRoleStorage _storage;

  UserRole _role = UserRole.client;
  UserRole get role => _role;
  bool get isProvider => _role == UserRole.provider;

  Future<void> load() async {
    _role = await _storage.read();
    notifyListeners();
  }

  Future<void> toggle() =>
      setRole(isProvider ? UserRole.client : UserRole.provider);

  Future<void> setRole(UserRole role) async {
    if (_role == role) return;
    _role = role;
    notifyListeners();
    await _storage.save(role);
  }
}
