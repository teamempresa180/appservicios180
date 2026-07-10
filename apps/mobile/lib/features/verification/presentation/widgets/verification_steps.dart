import 'package:flutter/material.dart';
import '../../../../core/ui/widgets/app_card.dart';
import '../../../../core/ui/widgets/app_section_title.dart';
import '../../models/verification_display.dart';
import 'verification_step_card.dart';

/// Lists every completed step and every pending step
/// (`VerificationDisplay.completedSteps`/`pendingSteps`, both
/// **simulated** — see the feature README) via `VerificationStepCard`.
class VerificationSteps extends StatelessWidget {
  const VerificationSteps({super.key, required this.data});

  final VerificationDisplay data;

  @override
  Widget build(BuildContext context) {
    return AppCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const AppSectionTitle(title: 'Pasos completados'),
          for (final step in data.completedSteps)
            VerificationStepCard(label: step, isCompleted: true),
          const AppSectionTitle(title: 'Pasos pendientes'),
          for (final step in data.pendingSteps)
            VerificationStepCard(label: step, isCompleted: false),
        ],
      ),
    );
  }
}
