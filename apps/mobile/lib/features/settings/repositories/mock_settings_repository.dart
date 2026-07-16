import '../../../profiles/entities/profile.dart';
import '../mock/mock_settings_data.dart';
import '../models/settings_option.dart';
import 'settings_repository.dart';

/// In-memory `SettingsRepository` backed by fixed mock data. No
/// backend, no persistence, no network — see the feature README.
class MockSettingsRepository implements SettingsRepository {
  @override
  Future<Profile> getProfile() => Future.value(mockSettingsProfile);

  @override
  Future<List<SettingsOptionId>> getOptions() =>
      Future.value(List.unmodifiable(mockSettingsOptions));
}
