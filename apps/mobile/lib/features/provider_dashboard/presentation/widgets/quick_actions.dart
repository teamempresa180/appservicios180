import 'package:flutter/material.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_button.dart';

/// "Ver servicios"/"Disponibilidad"/"Estadísticas"/"Configuración"
/// quick actions. Purely visual — every button is a documented no-op
/// (see the feature README).
class QuickActions extends StatelessWidget {
  const QuickActions({
    super.key,
    this.onViewServices,
    this.onAvailability,
    this.onStatistics,
    this.onSettings,
  });

  final VoidCallback? onViewServices;
  final VoidCallback? onAvailability;
  final VoidCallback? onStatistics;
  final VoidCallback? onSettings;

  @override
  Widget build(BuildContext context) {
    return Wrap(
      spacing: AppSpacing.space8,
      runSpacing: AppSpacing.space8,
      children: [
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
