import 'package:flutter/material.dart';
import '../../../../core/ui/extensions/context_theme_extensions.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_card.dart';
import '../../models/category_display.dart';

/// A single category tile: icon, name, short description and a
/// simulated services count. Reuses `AppCard` only. The icon is
/// resolved from `Category.icon` (a plain string identifier on the
/// domain entity) — that mapping is a presentation concern, kept local
/// to this widget.
///
/// Deliberately ignores `Category.color`: no branding/corporate colors
/// exist yet, so every tile uses the neutral theme color regardless of
/// what the domain entity carries.
class CategoryGridItem extends StatelessWidget {
  const CategoryGridItem({super.key, required this.display});

  final CategoryDisplay display;

  static const Map<String, IconData> _icons = {
    'plumbing': Icons.plumbing_outlined,
    'electricity': Icons.electrical_services_outlined,
    'cleaning': Icons.cleaning_services_outlined,
    'gardening': Icons.yard_outlined,
    'painting': Icons.format_paint_outlined,
    'pets': Icons.pets_outlined,
    'technology': Icons.devices_outlined,
    'beauty': Icons.spa_outlined,
    'construction': Icons.construction_outlined,
    'moving': Icons.local_shipping_outlined,
    'locksmith': Icons.key_outlined,
    'climate': Icons.ac_unit_outlined,
  };

  @override
  Widget build(BuildContext context) {
    final category = display.category;

    return AppCard(
      padding: const EdgeInsets.all(AppSpacing.space12),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(
            _icons[category.icon] ?? Icons.category_outlined,
            color: context.colors.primary,
          ),
          const SizedBox(height: AppSpacing.space8),
          Text(
            category.name,
            style: context.textStyles.titleSmall,
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
          ),
          const SizedBox(height: AppSpacing.space4),
          Expanded(
            child: Text(
              category.description,
              style: context.textStyles.bodySmall,
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
            ),
          ),
          const SizedBox(height: AppSpacing.space4),
          Text(
            '${display.servicesCount} servicios',
            style: context.textStyles.bodySmall,
          ),
        ],
      ),
    );
  }
}
