import 'package:flutter/material.dart';
import '../../../../category/entities/category.dart';
import '../../../../core/ui/extensions/context_theme_extensions.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_card.dart';
import '../../../../core/ui/widgets/app_section_title.dart';

/// Horizontally scrollable row of quick service categories (Cliente
/// Home only), backed by the real [Category] list (see
/// `ClientHomeContent`, which loads it from the same `CategoryRepository`
/// the Marketplace/Buscar tab uses — so tapping one always matches a
/// category that actually exists on Buscar). Tapping one jumps to
/// "Buscar" pre-filtered to that category — see
/// [onCategoryTap]/`AppShellNavigationIntent`.
class QuickCategories extends StatelessWidget {
  const QuickCategories({
    super.key,
    required this.categories,
    this.onCategoryTap,
  });

  final List<Category> categories;
  final ValueChanged<Category>? onCategoryTap;

  /// Mirrors `CategoryChip`/`CategoryGridItem`'s icon mapping (kept
  /// local — this presentation concern isn't shared as domain logic).
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
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const AppSectionTitle(title: 'Categorías rápidas'),
        SizedBox(
          height: 104,
          child: ListView.separated(
            scrollDirection: Axis.horizontal,
            itemCount: categories.length,
            separatorBuilder: (context, index) =>
                const SizedBox(width: AppSpacing.space12),
            itemBuilder: (context, index) {
              final category = categories[index];
              return SizedBox(
                width: 96,
                child: AppCard(
                  onTap: onCategoryTap == null
                      ? null
                      : () => onCategoryTap!(category),
                  padding: const EdgeInsets.all(AppSpacing.space8),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(
                        _icons[category.icon] ?? Icons.build_outlined,
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
            },
          ),
        ),
      ],
    );
  }
}
