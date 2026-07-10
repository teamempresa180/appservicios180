import '../../../profiles/entities/profile.dart';
import 'settings_option.dart';

/// Presentation-only composition of everything the Settings screen
/// needs. Composes one real domain entity — [profile] (for the header
/// recap) — plus [options]: **fully simulated**, since no domain
/// module models "application settings" as one of the 22 business
/// modules. See the feature README.
///
/// No `Color` or `IconData` is stored anywhere in this model —
/// `SettingsOptionTile` resolves both purely from `SettingsOptionId` +
/// `context.colors.*`/`Icons.*` at build time.
class SettingsDisplay {
  const SettingsDisplay({required this.profile, required this.options});

  final Profile profile;
  final List<SettingsOptionId> options;

  String get displayName => profile.displayName;
}
