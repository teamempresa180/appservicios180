import 'package:flutter/material.dart';
import '../../../../core/ui/widgets/app_empty_state.dart';

/// Visual-only empty state for the Trust screen. Reuses
/// `AppEmptyState` — no new Core UI widget.
class TrustEmptyState extends StatelessWidget {
  const TrustEmptyState({super.key});

  @override
  Widget build(BuildContext context) {
    return const AppEmptyState(
      title: 'Sin registro de confianza',
      description:
          'Todavía no existe un puntaje de confianza calculado '
          'para esta cuenta.',
      icon: Icons.shield_outlined,
    );
  }
}
