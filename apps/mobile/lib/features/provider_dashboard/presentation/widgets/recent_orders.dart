import 'package:flutter/material.dart';
import '../../../../core/ui/extensions/context_theme_extensions.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_button.dart';
import '../../models/provider_dashboard_display.dart';

/// Priority #5 (least prominent) on the Provider Dashboard: history —
/// completed/cancelled/rejected orders (`ProviderDashboardDisplay
/// .historyOrders`). Deliberately just a low-key "ver historial" link
/// with a count instead of an inline list: the full detail already
/// lives on the "Servicios" screen's "Historial" tab
/// (`ProviderRequestsPage`), so repeating it here at equal visual
/// weight to the actionable sections above would undercut the explicit
/// "guide the provider to what matters now" priority order.
class RecentOrders extends StatelessWidget {
  const RecentOrders({super.key, required this.data, this.onViewHistory});

  final ProviderDashboardDisplay data;
  final VoidCallback? onViewHistory;

  @override
  Widget build(BuildContext context) {
    final count = data.historyOrders.length;

    return Padding(
      padding: const EdgeInsets.symmetric(vertical: AppSpacing.space4),
      child: Row(
        children: [
          Expanded(
            child: Text(
              count == 0
                  ? 'Todavía no tienes historial.'
                  : 'Tienes $count servicio${count == 1 ? '' : 's'} en tu historial.',
              style: context.textStyles.bodySmall,
            ),
          ),
          AppButton(
            label: 'Ver historial',
            variant: AppButtonVariant.text,
            expand: false,
            onPressed: count == 0 ? null : onViewHistory,
          ),
        ],
      ),
    );
  }
}
