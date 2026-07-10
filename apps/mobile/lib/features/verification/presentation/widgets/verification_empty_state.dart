import 'package:flutter/material.dart';
import '../../../../core/ui/widgets/app_empty_state.dart';

/// Visual-only empty state for the Verification screen. Reuses
/// `AppEmptyState` — no new Core UI widget.
class VerificationEmptyState extends StatelessWidget {
  const VerificationEmptyState({super.key});

  @override
  Widget build(BuildContext context) {
    return const AppEmptyState(
      title: 'Sin verificación iniciada',
      description:
          'Sube tu documento de identidad y una selfie para '
          'comenzar tu verificación.',
      icon: Icons.verified_user_outlined,
    );
  }
}
