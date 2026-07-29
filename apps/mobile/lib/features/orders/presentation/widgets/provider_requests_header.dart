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
class ProviderRequestsHeader extends StatelessWidget {
  const ProviderRequestsHeader({
    super.key,
    required this.selectedTab,
    required this.onTabChanged,
  });

  final ProviderRequestsTab selectedTab;
  final ValueChanged<ProviderRequestsTab> onTabChanged;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const AppSectionTitle(
          title: 'Servicios',
          subtitle: 'Solicitudes de clientes y tu historial',
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
