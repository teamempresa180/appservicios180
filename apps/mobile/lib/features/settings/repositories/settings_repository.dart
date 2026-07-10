import '../../../profiles/entities/profile.dart';
import '../models/settings_option.dart';

/// Contract for reading the domain entities the Settings screen needs.
/// Returns only real domain entities — no `Map`, no `dynamic`, no
/// JSON. Implemented today by `MockSettingsRepository`; a future
/// `ApiSettingsRepository` would implement this same interface (see
/// the feature README).
abstract class SettingsRepository {
  Profile getProfile();
  List<SettingsOptionId> getOptions();
}
