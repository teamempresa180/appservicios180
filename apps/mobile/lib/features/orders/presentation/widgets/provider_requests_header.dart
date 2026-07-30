import 'package:flutter/material.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_chip.dart';
import '../../../../core/ui/widgets/app_section_title.dart';

/// The two real (not purely-visual) filters the "Servicios" screen
/// supports — see `ProviderRequestsViewModel.activeRequests`/
/// `historyRequests`.
enum ProviderRequestsTab { active, history }

extension ProviderRequestsTabLabel on ProviderRequestsTab {
  String get label {
    switch (this) {
      case ProviderRequestsTab.active:
        return 'Activas';
      case ProviderRequestsTab.history:
        return 'Historial';
    }
  }
}

/// Provider "Servicios" screen title plus the Activas/Historial tab
/// selector — unlike `OrderStatusTabs` (purely visual on the client's
/// Orders screen), selecting a tab here actually changes which list
/// `ProviderRequestsPage` shows (see `onTabChanged`).
///
/// [onViewReviews], when provided, renders a "Ver reseñas" action next
/// to the title — the only entry point into `ReviewsPage` for a
/// provider to see the ratings clients have left them (that screen has
/// no other route/nav destination pointing at it yet).
class ProviderRequestsHeader extends StatelessWidget {
  const ProviderRequestsHeader({
    super.key,
    required this.selectedTab,
    required this.onTabChanged,
    this.onViewReviews,
  });

  final ProviderRequestsTab selectedTab;
  final ValueChanged<ProviderRequestsTab> onTabChanged;
  final VoidCallback? onViewReviews;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        AppSectionTitle(
          title: 'Servicios',
          subtitle: 'Solicitudes de clientes y tu historial',
          actionLabel: onViewReviews == null ? null : 'Ver reseñas',
          onActionTap: onViewReviews,
        ),
        const SizedBox(height: AppSpacing.space12),
        Row(
          children: [
            for (final tab in ProviderRequestsTab.values) ...[
              AppChip(
                label: tab.label,
                selected: selectedTab == tab,
                onTap: () => onTabChanged(tab),
              ),
              const SizedBox(width: AppSpacing.space8),
            ],
          ],
        ),
      ],
    );
  }
}
