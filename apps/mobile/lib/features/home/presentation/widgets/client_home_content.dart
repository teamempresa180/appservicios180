import 'package:flutter/material.dart';
import '../../../../core/ui/animations/scale_in.dart';
import '../../../../core/ui/animations/slide_in.dart';
import '../../../../core/ui/extensions/context_theme_extensions.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_card.dart';
import '../../../../core/ui/widgets/app_section_title.dart';
import '../mock/mock_home_data.dart';
import 'quick_categories.dart';
import 'recent_services.dart';

/// Cliente-specific Home content: a prompt card, quick category
/// shortcuts and recent services. All data is mock (see
/// [MockHomeData]) — no backend, no real search or ordering.
class ClientHomeContent extends StatelessWidget {
  const ClientHomeContent({super.key});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        ScaleIn(
          child: AppCard(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const AppSectionTitle(title: '¿Qué servicio necesitas hoy?'),
                Text(
                  'Elige una categoría para empezar a buscar.',
                  style: context.textStyles.bodyMedium,
                ),
              ],
            ),
          ),
        ),
        const SizedBox(height: AppSpacing.space16),
        SlideIn(
          child: QuickCategories(categories: MockHomeData.quickCategories),
        ),
        const SizedBox(height: AppSpacing.space16),
        SlideIn(
          child: RecentServices(services: MockHomeData.recentServices),
        ),
      ],
    );
  }
}
