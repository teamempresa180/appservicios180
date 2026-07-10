import 'package:flutter/material.dart';
import '../../../../core/ui/widgets/app_empty_state.dart';

/// Visual-only empty state for the Profile screen. Reuses
/// `AppEmptyState` — no new Core UI widget.
class ProfileEmptyState extends StatelessWidget {
  const ProfileEmptyState({super.key});

  @override
  Widget build(BuildContext context) {
    return const AppEmptyState(
      title: 'Sin información de perfil',
      description: 'No pudimos cargar los datos de tu cuenta.',
      icon: Icons.person_outline,
    );
  }
}
