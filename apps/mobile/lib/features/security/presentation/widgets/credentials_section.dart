import 'package:flutter/material.dart';
import '../../../../core/ui/extensions/context_theme_extensions.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_section.dart';
import '../../models/security_display.dart';
import 'credential_card.dart';

/// Lists every real `Credential` (see `SecurityDisplay` and the
/// feature README) via `CredentialCard`, plus a per-status summary —
/// all **derived**, no simulated field involved. Added as a **planned
/// extension** of this feature, not a new one — see the README.
class CredentialsSection extends StatelessWidget {
  const CredentialsSection({super.key, required this.data});

  final SecurityDisplay data;

  @override
  Widget build(BuildContext context) {
    return AppSection(
      title: 'Credenciales',
      children: [
        Text(
          '${data.activeCredentialsCount} activas · '
          '${data.expiredCredentialsCount} expiradas · '
          '${data.revokedCredentialsCount} revocadas',
          style: context.textStyles.bodySmall,
        ),
        const SizedBox(height: AppSpacing.space8),
        for (final credential in data.credentials)
          CredentialCard(credential: credential),
      ],
    );
  }
}
