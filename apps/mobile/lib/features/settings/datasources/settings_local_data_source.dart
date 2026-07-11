import '../../../profiles/entities/profile.dart';
import '../models/settings_option.dart';

/// Local (on-device) source for the domain entities the Settings
/// screen needs. No implementation — see `PROJECT_STATUS.md` (Sprint
/// 2, Etapa 6).
abstract class SettingsLocalDataSource {
  Profile getProfile();
  List<SettingsOptionId> getOptions();
}
