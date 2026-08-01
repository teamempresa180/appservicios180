import 'package:flutter/material.dart';
import '../../../../authentication/entities/authentication.dart';
import '../../../../authentication/models/authentication_status.dart';
import '../../../../core/ui/extensions/context_theme_extensions.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_badge.dart';
import '../../../../core/ui/widgets/app_card.dart';
import '../../../../core/ui/widgets/app_icon_row.dart';
import 'auth_method_actions.dart';
import 'auth_method_type_labels.dart';

/// A single real `Authentication` method: type icon, label and status
/// badge. No color/icon stored anywhere — resolved here from
/// `context.colors.*`, same rule already applied in
/// `OrderStatusBadge`/`ContactCard`.
class AuthMethodCard extends StatelessWidget {
  const AuthMethodCard({
    super.key,
    required this.authMethod,
    this.onDisable,
    this.onDelete,
  });

  final Authentication authMethod;
  final VoidCallback? onDisable;
  final VoidCallback? onDelete;

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
            icon: authMethodTypeIcon(authMethod.methodType),
            iconColor: context.colors.primary,
            iconSize: null,
            padded: false,
            title: authMethodTypeLabel(authMethod.methodType),
            trailing: AppBadge(
              label: _statusLabel(authMethod.status),
              color: color,
            ),
          ),
          const SizedBox(height: AppSpacing.space12),
          AuthMethodActions(
            isActive: authMethod.status == AuthenticationStatus.active,
            onDisable: onDisable,
            onDelete: onDelete,
          ),
        ],
      ),
    );
  }
}
