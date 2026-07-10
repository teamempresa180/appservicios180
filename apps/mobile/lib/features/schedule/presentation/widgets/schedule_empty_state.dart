import 'package:flutter/material.dart';
import '../../../../core/ui/widgets/app_empty_state.dart';

/// Visual-only empty state for the Schedule screen. Reuses
/// `AppEmptyState` — no new Core UI widget.
class ScheduleEmptyState extends StatelessWidget {
  const ScheduleEmptyState({super.key});

  @override
  Widget build(BuildContext context) {
    return const AppEmptyState(
      title: 'Sin bloques en la agenda',
      description: 'Todavía no existen bloques de tiempo programados.',
      icon: Icons.event_busy_outlined,
    );
  }
}
