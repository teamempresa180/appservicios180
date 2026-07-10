import 'package:flutter/material.dart';
import '../../../../core/ui/extensions/context_theme_extensions.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_card.dart';
import '../../models/settings_option.dart';

/// A single settings menu row. Resolves its icon purely from
/// `SettingsOptionId` + `context.colors.*` — no icon/color is stored
/// in any model. Purely visual — [onTap] is a no-op by default except
/// where the caller wires a real navigation (see `SettingsPage` for
/// "Direcciones").
class SettingsOptionTile extends StatelessWidget {
  const SettingsOptionTile({super.key, required this.option, this.onTap});

  final SettingsOptionId option;
  final VoidCallback? onTap;

  IconData _iconFor(SettingsOptionId option) {
    switch (option) {
      case SettingsOptionId.addresses:
        return Icons.location_on_outlined;
      case SettingsOptionId.contacts:
        return Icons.contact_mail_outlined;
      case SettingsOptionId.security:
        return Icons.security_outlined;
      case SettingsOptionId.notifications:
        return Icons.notifications_outlined;
      case SettingsOptionId.privacy:
        return Icons.lock_outline;
      case SettingsOptionId.help:
        return Icons.help_outline;
      case SettingsOptionId.logout:
        return Icons.logout;
    }
  }

  @override
  Widget build(BuildContext context) {
    return AppCard(
      onTap: onTap ?? () {},
      child: Row(
        children: [
          Icon(_iconFor(option), color: context.colors.primary),
          const SizedBox(width: AppSpacing.space12),
          Expanded(
            child: Text(option.label, style: context.textStyles.bodyMedium),
          ),
          Icon(Icons.chevron_right, color: context.colors.secondary),
        ],
      ),
    );
  }
}
