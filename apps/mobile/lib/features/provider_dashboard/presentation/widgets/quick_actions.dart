import 'package:flutter/material.dart';
import '../../../../core/ui/widgets/app_action_row.dart';
import '../../../../core/ui/widgets/app_button.dart';

/// "Ver servicios"/"Disponibilidad"/"Agenda"/"Configuración" quick
/// actions — all four navigate to a real screen. The previous
/// "Estadísticas" action is gone: it opened nothing (a documented
/// no-op) and duplicated content already visible a scroll away on this
/// same dashboard ([DashboardStatistics]/[ProviderPerformance]), so it
/// was a dead button rather than a missing feature.
class QuickActions extends StatelessWidget {
  const QuickActions({
    super.key,
    this.onViewServices,
    this.onAvailability,
    this.onSchedule,
    this.onSettings,
  });

  final VoidCallback? onViewServices;
  final VoidCallback? onAvailability;
  final VoidCallback? onSchedule;
  final VoidCallback? onSettings;

  @override
  Widget build(BuildContext context) {
    return AppActionRow(
      actions: [
        AppButton(
          label: 'Ver servicios',
          onPressed: onViewServices ?? () {},
          expand: false,
        ),
        AppButton(
          label: 'Disponibilidad',
          onPressed: onAvailability ?? () {},
          expand: false,
        ),
        AppButton(
          label: 'Agenda',
          onPressed: onSchedule ?? () {},
          expand: false,
        ),
        AppButton(
          label: 'Configuración',
          onPressed: onSettings ?? () {},
          expand: false,
        ),
      ],
    );
  }
}
