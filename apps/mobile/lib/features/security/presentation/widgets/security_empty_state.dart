import 'package:flutter/material.dart';
import '../../../../core/ui/widgets/app_empty_state.dart';

/// Visual-only empty state for the Security screen. Reuses
/// `AppEmptyState` — no new Core UI widget.
class SecurityEmptyState extends StatelessWidget {
  const SecurityEmptyState({super.key});

  @override
  Widget build(BuildContext context) {
    return const AppEmptyState(
      title: 'Sin métodos de acceso',
      description: 'Agrega un método para proteger el acceso a tu cuenta.',
      icon: Icons.security_outlined,
    );
  }
}
