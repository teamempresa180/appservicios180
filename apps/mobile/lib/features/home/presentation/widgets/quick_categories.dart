import 'package:flutter/material.dart';
import '../../../../core/ui/extensions/context_theme_extensions.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_card.dart';
import '../../../../core/ui/widgets/app_section_title.dart';

/// Horizontally scrollable row of mock service categories (Cliente Home
/// only). Purely visual — tapping a category does nothing yet, real
/// selection will come once `Category` is wired up (see the feature
/// README).
class QuickCategories extends StatelessWidget {
  const QuickCategories({super.key, required this.categories});

  final List<String> categories;

  static const Map<String, IconData> _icons = {
    'Plomería': Icons.plumbing_outlined,
    'Electricidad': Icons.electrical_services_outlined,
    'Limpieza': Icons.cleaning_services_outlined,
    'Jardinería': Icons.yard_outlined,
    'Pintura': Icons.format_paint_outlined,
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
                  padding: const EdgeInsets.all(AppSpacing.space8),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(
                        _icons[category] ?? Icons.build_outlined,
                        color: context.colors.primary,
                      ),
                      const SizedBox(height: AppSpacing.space4),
                      Text(
                        category,
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
