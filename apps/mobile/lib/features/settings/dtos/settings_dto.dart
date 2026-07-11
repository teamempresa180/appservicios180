import '../../../profiles/entities/profile.dart';
import '../models/settings_option.dart';

/// Plain data shape a future `SettingsRemoteDataSource` would receive
/// from a real API response for this screen — the same fields
/// [SettingsDisplay] composes, but without its derived getters. No
/// `fromJson`/`toJson` yet — only the structure, see
/// `PROJECT_STATUS.md` (Sprint 2, Etapa 6).
class SettingsDto {
  const SettingsDto({required this.profile, required this.options});

  final Profile profile;
  final List<SettingsOptionId> options;
}
