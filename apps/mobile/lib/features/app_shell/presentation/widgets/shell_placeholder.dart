import 'package:flutter/material.dart';
import '../../../../core/ui/animations/scale_in.dart';
import '../../../../core/ui/extensions/context_theme_extensions.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_card.dart';
import '../../../../core/ui/widgets/app_divider.dart';
import '../../../../core/ui/widgets/app_section_title.dart';

/// Elegant placeholder shown for a single App Shell destination until its
/// real screen is built. [title] and [description] must clearly state
/// which future screen this stands in for — reuses the existing Design
/// System only.
class ShellPlaceholder extends StatelessWidget {
  const ShellPlaceholder({
    super.key,
    required this.icon,
    required this.title,
    required this.description,
  });

  final IconData icon;
  final String title;
  final String description;

  @override
  Widget build(BuildContext context) {
    return Center(
      child: SingleChildScrollView(
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 480),
          child: ScaleIn(
            child: AppCard(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Icon(
                    icon,
                    size: AppSpacing.space48,
                    color: context.colors.primary,
                  ),
                  AppSectionTitle(title: title),
                  const AppDivider(),
                  Text(
                    description,
                    textAlign: TextAlign.center,
                    style: context.textStyles.bodyMedium,
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
