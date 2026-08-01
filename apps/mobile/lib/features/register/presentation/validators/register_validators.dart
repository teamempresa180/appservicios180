/// Local, dependency-free validation rules for the Register form. No
/// package is used — just plain string/date checks.
abstract final class RegisterValidators {
  static const int minPasswordLength = 8;

  /// Hard caps on the name/document fields — also wired as each
  /// `AppTextField`'s `maxLength` so the input itself can't grow past
  /// this, not just the validator message. Long enough for any real
  /// full name/document while still guarding against pasted walls of
  /// text overflowing cards elsewhere in the app (Profile, Security).
  static const int maxFullNameLength = 100;
  static const int maxDocumentNumberLength = 20;

  static String? fullName(String? value) {
    final trimmed = value?.trim() ?? '';
    if (trimmed.isEmpty) return 'El nombre completo es obligatorio.';
    if (trimmed.length > maxFullNameLength) {
      return 'El nombre no puede superar $maxFullNameLength caracteres.';
    }
    return null;
  }

  static String? documentNumber(String? value) {
    final trimmed = value?.trim() ?? '';
    if (trimmed.isEmpty) return 'El número de documento es obligatorio.';
    if (trimmed.length > maxDocumentNumberLength) {
      return 'El número de documento no puede superar $maxDocumentNumberLength caracteres.';
    }
    return null;
  }

  static String? password(String? value) {
    final raw = value ?? '';
    if (raw.isEmpty) return 'La contraseña es obligatoria.';
    if (raw.length < minPasswordLength) {
      return 'La contraseña debe tener al menos $minPasswordLength caracteres.';
    }
    return null;
  }

  static String? confirmPassword(String? value, String password) {
    final raw = value ?? '';
    if (raw.isEmpty) return 'Confirma tu contraseña.';
    if (raw != password) return 'Las contraseñas no coinciden.';
    return null;
  }
}
