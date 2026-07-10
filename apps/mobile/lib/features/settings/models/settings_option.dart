/// The settings menu entries this screen shows. A plain UI enum — no
/// domain module models "app settings" (it isn't one of the 22
/// business modules), so this entire list is **simulated**. See the
/// feature README.
enum SettingsOptionId { addresses, notifications, privacy, help, logout }

extension SettingsOptionLabel on SettingsOptionId {
  String get label {
    switch (this) {
      case SettingsOptionId.addresses:
        return 'Direcciones';
      case SettingsOptionId.notifications:
        return 'Notificaciones';
      case SettingsOptionId.privacy:
        return 'Privacidad';
      case SettingsOptionId.help:
        return 'Ayuda';
      case SettingsOptionId.logout:
        return 'Cerrar sesión';
    }
  }
}
