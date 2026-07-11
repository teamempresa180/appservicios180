import '../models/settings_display.dart';
import '../repositories/settings_repository.dart';

/// Composes a [SettingsDisplay] from a [SettingsRepository] — the
/// conversion this feature's page used to do inline in `_buildData()`.
/// Depends on the repository *contract*, not `MockSettingsRepository`
/// (see `PROJECT_STATUS.md`, Sprint 2, Etapa 6).
abstract final class SettingsMapper {
  static SettingsDisplay toDisplay(SettingsRepository repository) {
    return SettingsDisplay(
      profile: repository.getProfile(),
      options: repository.getOptions(),
    );
  }
}
