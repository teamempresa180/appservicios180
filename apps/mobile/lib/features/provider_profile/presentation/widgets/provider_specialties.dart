import 'package:flutter/material.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_card.dart';
import '../../../../core/ui/widgets/app_chip.dart';
import '../../../../core/ui/widgets/app_section_title.dart';

/// Specialty tags (fully simulated — no domain equivalent). Uses
/// `AppChip` (unselected) inside a `Wrap` so it never overflows
/// regardless of width.
class ProviderSpecialties extends StatelessWidget {
  const ProviderSpecialties({super.key, required this.specialties});

  final List<String> specialties;

  @override
  Widget build(BuildContext context) {
    return AppCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const AppSectionTitle(title: 'Especialidades'),
          Wrap(
            spacing: AppSpacing.space8,
            runSpacing: AppSpacing.space8,
            children: [
              for (final specialty in specialties) AppChip(label: specialty),
            ],
          ),
        ],
      ),
    );
  }
}
