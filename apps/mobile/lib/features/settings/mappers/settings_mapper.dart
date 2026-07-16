import '../models/settings_display.dart';
import '../repositories/settings_repository.dart';

/// Composes a [SettingsDisplay] from a [SettingsRepository] — the
/// conversion this feature's page used to do inline in `_buildData()`.
/// Depends on the repository *contract*, not `MockSettingsRepository`
/// (see `PROJECT_STATUS.md`, Sprint 2, Etapa 6). `Future`-returning
/// since [SettingsRepository]'s methods are.
abstract final class SettingsMapper {
  static Future<SettingsDisplay> toDisplay(SettingsRepository repository) async {
    final profile = await repository.getProfile();
    final options = await repository.getOptions();
    return SettingsDisplay(profile: profile, options: options);
  }
}
