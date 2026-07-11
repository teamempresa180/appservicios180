import 'package:flutter/material.dart';
import '../../../../authentication/entities/authentication.dart';
import '../../../../authentication/models/auth_method_type.dart';
import '../../../../authentication/models/authentication_status.dart';
import '../../../../core/ui/extensions/context_theme_extensions.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_badge.dart';
import '../../../../core/ui/widgets/app_card.dart';
import '../../../../core/ui/widgets/app_icon_row.dart';
import 'auth_method_actions.dart';

/// A single real `Authentication` method: type icon, label and status
/// badge. No color/icon stored anywhere — resolved here from
/// `context.colors.*`, same rule already applied in
/// `OrderStatusBadge`/`ContactCard`.
class AuthMethodCard extends StatelessWidget {
  const AuthMethodCard({super.key, required this.authMethod});

  final Authentication authMethod;

  IconData _iconFor(AuthMethodType type) {
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

  String _typeLabel(AuthMethodType type) {
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

  String _statusLabel(AuthenticationStatus status) {
    switch (status) {
      case AuthenticationStatus.active:
        return 'Activo';
      case AuthenticationStatus.inactive:
        return 'Inactivo';
      case AuthenticationStatus.locked:
        return 'Bloqueado';
      case AuthenticationStatus.revoked:
        return 'Revocado';
    }
  }

  Color _statusColor(BuildContext context, AuthenticationStatus status) {
    switch (status) {
      case AuthenticationStatus.active:
        return context.colors.primary;
      case AuthenticationStatus.inactive:
        return context.colors.secondary;
      case AuthenticationStatus.locked:
      case AuthenticationStatus.revoked:
        return context.colors.error;
    }
  }

  @override
  Widget build(BuildContext context) {
    final color = _statusColor(context, authMethod.status);

    return AppCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          AppIconRow(
            icon: _iconFor(authMethod.methodType),
            iconColor: context.colors.primary,
            iconSize: null,
            padded: false,
            title: _typeLabel(authMethod.methodType),
            trailing: AppBadge(
              label: _statusLabel(authMethod.status),
              color: color,
            ),
          ),
          const SizedBox(height: AppSpacing.space12),
          const AuthMethodActions(),
        ],
      ),
    );
  }
}
