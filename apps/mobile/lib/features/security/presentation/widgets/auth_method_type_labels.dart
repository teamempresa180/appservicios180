import 'package:flutter/material.dart';
import '../../../../authentication/models/auth_method_type.dart';

/// Icon/label for an [AuthMethodType] — shared by `AuthMethodCard` and
/// `AuthMethodTypeSheet` so both stay in sync.
IconData authMethodTypeIcon(AuthMethodType type) {
  switch (type) {
    case AuthMethodType.password:
      return Icons.password_outlined;
    case AuthMethodType.biometric:
      return Icons.fingerprint_outlined;
    case AuthMethodType.oneTimeCode:
      return Icons.pin_outlined;
    case AuthMethodType.thirdParty:
      return Icons.link_outlined;
    case AuthMethodType.other:
      return Icons.more_horiz_outlined;
  }
}

String authMethodTypeLabel(AuthMethodType type) {
  switch (type) {
    case AuthMethodType.password:
      return 'Contraseña';
    case AuthMethodType.biometric:
      return 'Biometría';
    case AuthMethodType.oneTimeCode:
      return 'Código de un solo uso';
    case AuthMethodType.thirdParty:
      return 'Cuenta de terceros';
    case AuthMethodType.other:
      return 'Otro método';
  }
}
