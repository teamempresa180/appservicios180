/// Local, dependency-free validation rules for the Login form. No
/// package is used — just plain string checks.
abstract final class LoginValidators {
  static const int minPasswordLength = 8;

  /// Hard cap on the document number field — also wired as the
  /// `AppTextField`'s `maxLength` so the input itself can't grow past
  /// this, not just the validator message.
  static const int maxDocumentNumberLength = 20;

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
}
