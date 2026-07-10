import 'package:flutter/material.dart';
import '../../../../core/ui/widgets/app_section_title.dart';

/// Availability title. No new Core UI widget — reuses
/// `AppSectionTitle`. The model composes `Provider` (per the prompt's
/// field list, no `Profile`), so there is no display name to show here
/// — a generic subtitle is used instead.
class AvailabilityHeader extends StatelessWidget {
  const AvailabilityHeader({super.key});

  @override
  Widget build(BuildContext context) {
    return const AppSectionTitle(
      title: 'Disponibilidad',
      subtitle: 'Gestiona tu horario semanal',
    );
  }
}
