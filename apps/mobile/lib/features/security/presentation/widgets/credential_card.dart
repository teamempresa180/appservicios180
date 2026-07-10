import 'package:flutter/material.dart';
import '../../../../core/ui/extensions/context_theme_extensions.dart';
import '../../../../core/ui/tokens/app_radius.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
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

    return Padding(
      padding: const EdgeInsets.symmetric(vertical: AppSpacing.space4),
      child: Row(
        children: [
          Icon(
            _iconFor(credential.type),
            size: AppSpacing.space20,
            color: context.colors.primary,
          ),
          const SizedBox(width: AppSpacing.space8),
          Expanded(
            child: Text(
              _typeLabel(credential.type),
              overflow: TextOverflow.ellipsis,
              style: context.textStyles.bodyMedium,
            ),
          ),
          Container(
            padding: const EdgeInsets.symmetric(
              horizontal: AppSpacing.space12,
              vertical: AppSpacing.space4,
            ),
            decoration: BoxDecoration(
              color: color.withValues(alpha: 0.12),
              borderRadius: BorderRadius.circular(AppRadius.radius8),
            ),
            child: Text(
              _statusLabel(credential.status),
              style: context.textStyles.bodySmall?.copyWith(
                color: color,
                fontWeight: FontWeight.w600,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
