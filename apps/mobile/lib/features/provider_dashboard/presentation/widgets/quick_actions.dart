import 'package:flutter/material.dart';
import '../../../../core/ui/widgets/app_action_row.dart';
import '../../../../core/ui/widgets/app_button.dart';

/// "Ver servicios"/"Disponibilidad"/"Agenda"/"Estadísticas"/
/// "Configuración" quick actions. "Agenda" opens the (visual-only,
/// fixed mock) Schedule screen — the only change authorized in the
/// Schedule prompt. The rest remain documented no-ops (see the feature
/// README).
class QuickActions extends StatelessWidget {
  const QuickActions({
    super.key,
    this.onViewServices,
    this.onAvailability,
    this.onSchedule,
    this.onStatistics,
    this.onSettings,
  });

  final VoidCallback? onViewServices;
  final VoidCallback? onAvailability;
  final VoidCallback? onSchedule;
  final VoidCallback? onStatistics;
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
          label: 'Estadísticas',
          onPressed: onStatistics ?? () {},
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
