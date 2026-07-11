import 'package:flutter/material.dart';
import '../../../../core/ui/extensions/context_theme_extensions.dart';
import '../../../../core/ui/widgets/app_badge.dart';
import '../../../../core/ui/widgets/app_icon_row.dart';
import '../../../../credentials/entities/credential.dart';
import '../../../../credentials/models/credential_status.dart';
import '../../../../credentials/models/credential_type.dart';

/// A single real `Credential` record: type icon, label and status
/// badge. Never shows the secret itself — the domain entity doesn't
/// store one. No color/icon stored anywhere — resolved here from
/// `context.colors.*`, same rule already applied in
/// `AuthMethodCard`/`ContactCard`.
class CredentialCard extends StatelessWidget {
  const CredentialCard({super.key, required this.credential});

  final Credential credential;

  IconData _iconFor(CredentialType type) {
    switch (type) {
      case CredentialType.password:
        return Icons.password_outlined;
      case CredentialType.recoveryCode:
        return Icons.vpn_key_outlined;
      case CredentialType.securityKey:
        return Icons.key_outlined;
      case CredentialType.other:
        return Icons.more_horiz_outlined;
    }
  }

  String _typeLabel(CredentialType type) {
    switch (type) {
      case CredentialType.password:
        return 'Contraseña';
      case CredentialType.recoveryCode:
        return 'Código de recuperación';
      case CredentialType.securityKey:
        return 'Llave de seguridad';
      case CredentialType.other:
        return 'Otra credencial';
    }
  }

  String _statusLabel(CredentialStatus status) {
    switch (status) {
      case CredentialStatus.active:
        return 'Activa';
      case CredentialStatus.expired:
        return 'Expirada';
      case CredentialStatus.revoked:
        return 'Revocada';
    }
  }

  Color _statusColor(BuildContext context, CredentialStatus status) {
    switch (status) {
      case CredentialStatus.active:
        return context.colors.primary;
      case CredentialStatus.expired:
        return context.colors.secondary;
      case CredentialStatus.revoked:
        return context.colors.error;
    }
  }

  @override
  Widget build(BuildContext context) {
    final color = _statusColor(context, credential.status);

    return AppIconRow(
      icon: _iconFor(credential.type),
      iconColor: context.colors.primary,
      title: _typeLabel(credential.type),
      trailing: AppBadge(label: _statusLabel(credential.status), color: color),
    );
  }
}
