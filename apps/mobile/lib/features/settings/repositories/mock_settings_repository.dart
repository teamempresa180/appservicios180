import '../../../profiles/entities/profile.dart';
import '../mock/mock_settings_data.dart';
import '../models/settings_option.dart';
import 'settings_repository.dart';

/// In-memory `SettingsRepository` backed by fixed mock data. No
/// backend, no persistence, no network — see the feature README.
class MockSettingsRepository implements SettingsRepository {
  @override
  Profile getProfile() => mockSettingsProfile;

  @override
  List<SettingsOptionId> getOptions() => List.unmodifiable(mockSettingsOptions);
}
