/// Local, dependency-free validation rules for the Register form. No
/// package is used — just plain string checks and a simple email-shape
/// regex, mirroring the rules already used by the Login feature.
abstract final class RegisterValidators {
  static final RegExp _emailPattern = RegExp(r'^[^@\s]+@[^@\s]+\.[^@\s]+$');

  static const int minPasswordLength = 8;

  static String? fullName(String? value) {
    final trimmed = value?.trim() ?? '';
    if (trimmed.isEmpty) return 'El nombre completo es obligatorio.';
    return null;
  }

  static String? email(String? value) {
    final trimmed = value?.trim() ?? '';
    if (trimmed.isEmpty) return 'El correo es obligatorio.';
    if (!_emailPattern.hasMatch(trimmed)) return 'Ingresa un correo válido.';
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
