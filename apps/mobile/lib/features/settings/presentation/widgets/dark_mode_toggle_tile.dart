import 'package:flutter/material.dart';
import '../../../../core/theme/theme_mode_controller.dart';
import '../../../../core/ui/extensions/context_theme_extensions.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_card.dart';

/// Local-only settings row (not backed by [SettingsRepository] — this
/// preference never touches the backend) that toggles [ThemeModeController].
class DarkModeToggleTile extends StatelessWidget {
  const DarkModeToggleTile({super.key, required this.controller});

  final ThemeModeController controller;

  @override
  Widget build(BuildContext context) {
    return ListenableBuilder(
      listenable: controller,
      builder: (context, _) {
        return AppCard(
          onTap: controller.toggle,
          child: Row(
            children: [
              Icon(
                controller.isDark
                    ? Icons.dark_mode_outlined
                    : Icons.light_mode_outlined,
                color: context.colors.primary,
              ),
              const SizedBox(width: AppSpacing.space12),
              Expanded(
                child: Text(
                  'Modo oscuro',
                  style: context.textStyles.bodyMedium,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
              ),
              Switch(
                value: controller.isDark,
                onChanged: (_) => controller.toggle(),
              ),
            ],
          ),
        );
      },
    );
  }
}
