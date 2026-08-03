import 'package:flutter/material.dart';
import '../../../../core/ui/extensions/context_theme_extensions.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_card.dart';

/// Explains, in one line, that editing the weekly schedule isn't
/// available yet.
///
/// This replaces what used to be four prominent buttons — "Editar
/// horario", "Copiar horario", "Limpiar horario" and "Guardar
/// disponibilidad" — each of which only raised the same
/// "próximamente" snackbar. Four primary-looking buttons that all
/// refuse to do anything is worse than saying so once: a pilot tester
/// taps every one of them before believing it. There is still no
/// per-slot editing UI and no bulk "replace my weekly schedule"
/// endpoint on the backend (only single-record
/// `PUT /availabilities/:id`), so building real inline editing remains
/// a new feature, out of scope here.
class AvailabilityActions extends StatelessWidget {
  const AvailabilityActions({super.key});

  @override
  Widget build(BuildContext context) {
    return AppCard(
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(
            Icons.info_outline,
            size: AppSpacing.space20,
            color: context.colors.secondary,
          ),
          const SizedBox(width: AppSpacing.space8),
          Expanded(
            child: Text(
              'Por ahora tu horario se configura con nuestro equipo. La '
              'edición desde la app estará disponible próximamente.',
              style: context.textStyles.bodySmall,
            ),
          ),
        ],
      ),
    );
  }
}
