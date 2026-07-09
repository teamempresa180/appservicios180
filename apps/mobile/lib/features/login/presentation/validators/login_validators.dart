/// Local, dependency-free validation rules for the Login form. No package
/// is used — just plain string checks and a simple email-shape regex.
abstract final class LoginValidators {
  static final RegExp _emailPattern = RegExp(r'^[^@\s]+@[^@\s]+\.[^@\s]+$');

  static const int minPasswordLength = 8;

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
}
