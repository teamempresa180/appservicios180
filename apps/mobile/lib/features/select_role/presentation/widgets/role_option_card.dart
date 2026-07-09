import 'package:flutter/material.dart';
import '../../../../core/ui/extensions/context_theme_extensions.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_button.dart';
import '../../../../core/ui/widgets/app_card.dart';

/// A single selectable role option (Cliente / Proveedor). Purely
/// presentational — composes AppCard, a Material Icon and AppButton, no
/// new Core UI widget is introduced.
class RoleOptionCard extends StatelessWidget {
  const RoleOptionCard({
    super.key,
    required this.icon,
    required this.title,
    required this.description,
    required this.buttonLabel,
    required this.onPressed,
  });

  final IconData icon;
  final String title;
  final String description;
  final String buttonLabel;
  final VoidCallback onPressed;

  @override
  Widget build(BuildContext context) {
    return AppCard(
      child: Column(
        children: [
          Icon(icon, size: AppSpacing.space48, color: context.colors.primary),
          const SizedBox(height: AppSpacing.space12),
          Text(title, style: context.textStyles.titleMedium),
          const SizedBox(height: AppSpacing.space8),
          Text(
            description,
            textAlign: TextAlign.center,
            style: context.textStyles.bodyMedium,
          ),
          const SizedBox(height: AppSpacing.space16),
          AppButton(label: buttonLabel, onPressed: onPressed),
        ],
      ),
    );
  }
}
