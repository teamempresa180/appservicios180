import 'package:flutter/foundation.dart';
import 'provider_availability_storage.dart';

/// Single source of truth for whether the provider is currently
/// "Disponible" or "Ocupado" — a quick status the provider flips from
/// Home, independent of the detailed weekly schedule
/// (`AvailabilityPage`). A [ChangeNotifier] so `HomeHeader` can rebuild
/// the moment it changes. Defaults to available until [load] resolves
/// the persisted value.
class ProviderAvailabilityController extends ChangeNotifier {
  ProviderAvailabilityController({required ProviderAvailabilityStorage storage})
    : _storage = storage;

  final ProviderAvailabilityStorage _storage;

  bool _isAvailable = true;
  bool get isAvailable => _isAvailable;

  Future<void> load() async {
    _isAvailable = await _storage.read();
    notifyListeners();
  }

  Future<void> toggle() => setAvailable(!_isAvailable);

  Future<void> setAvailable(bool isAvailable) async {
    if (_isAvailable == isAvailable) return;
    _isAvailable = isAvailable;
    notifyListeners();
    await _storage.save(isAvailable);
  }
}
