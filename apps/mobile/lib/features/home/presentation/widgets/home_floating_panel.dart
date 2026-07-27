import 'package:flutter/material.dart';
import '../../../../core/di/service_locator.dart';
import '../../../../core/ui/extensions/context_theme_extensions.dart';
import '../../../../core/ui/tokens/app_radius.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_section_title.dart';
import '../../../app_shell/navigation_intent.dart';
import '../mock/mock_home_data.dart';
import '../../../../core/session/user_role.dart';
import 'quick_categories.dart';

/// Static (non-draggable) panel floating over [HomeMapBackground] —
/// Uber/inDrive-style: a fixed rounded sheet anchored to the bottom of
/// the map, not a `DraggableScrollableSheet`. Rounded only at the top,
/// so it reads as an extension of the bottom navigation bar beneath it.
class HomeFloatingPanel extends StatelessWidget {
  const HomeFloatingPanel({super.key, required this.role});

  final UserRole role;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.fromLTRB(
        AppSpacing.space20,
        AppSpacing.space20,
        AppSpacing.space20,
        AppSpacing.space16,
      ),
      decoration: BoxDecoration(
        color: context.colors.surface,
        borderRadius: const BorderRadius.only(
          topLeft: Radius.circular(AppRadius.radius24),
          topRight: Radius.circular(AppRadius.radius24),
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.08),
            blurRadius: 24,
            offset: const Offset(0, -4),
          ),
        ],
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Center(
            child: Container(
              width: 36,
              height: 4,
              margin: const EdgeInsets.only(bottom: AppSpacing.space16),
              decoration: BoxDecoration(
                color: context.colors.outlineVariant,
                borderRadius: BorderRadius.circular(AppRadius.radiusPill),
              ),
            ),
          ),
          const AppSectionTitle(title: '¿Qué servicio necesitas hoy?'),
          Padding(
            padding: const EdgeInsets.only(bottom: AppSpacing.space16),
            child: Text(
              'Elige una categoría para empezar a buscar.',
              style: context.textStyles.bodyMedium,
            ),
          ),
          QuickCategories(
            categories: MockHomeData.quickCategories,
            onCategoryTap: (category) => locator<AppShellNavigationIntent>()
                .goToBuscarWithCategory(category),
          ),
        ],
      ),
    );
  }
}
