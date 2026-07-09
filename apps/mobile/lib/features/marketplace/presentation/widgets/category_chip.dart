import 'package:flutter/material.dart';
import '../../../../category/entities/category.dart';
import '../../../../core/ui/extensions/context_theme_extensions.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_card.dart';

/// A single category shortcut. Reuses `AppCard` + a Material Icon
/// resolved from `Category.icon` (a plain string identifier on the
/// domain entity — the mapping to an actual `IconData` is a presentation
/// concern, kept local to this widget).
///
/// Deliberately ignores `Category.color`: no branding/corporate colors
/// exist yet, so every chip uses the neutral theme color regardless of
/// what the domain entity carries.
class CategoryChip extends StatelessWidget {
  const CategoryChip({super.key, required this.category});

  final Category category;

  static const Map<String, IconData> _icons = {
    'plumbing': Icons.plumbing_outlined,
    'electricity': Icons.electrical_services_outlined,
    'cleaning': Icons.cleaning_services_outlined,
    'gardening': Icons.yard_outlined,
    'painting': Icons.format_paint_outlined,
    'pets': Icons.pets_outlined,
    'technology': Icons.devices_outlined,
    'beauty': Icons.spa_outlined,
  };

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: 96,
      child: AppCard(
        padding: const EdgeInsets.all(AppSpacing.space8),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              _icons[category.icon] ?? Icons.category_outlined,
              color: context.colors.primary,
            ),
            const SizedBox(height: AppSpacing.space4),
            Text(
              category.name,
              textAlign: TextAlign.center,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              style: context.textStyles.bodySmall,
            ),
          ],
        ),
      ),
    );
  }
}
