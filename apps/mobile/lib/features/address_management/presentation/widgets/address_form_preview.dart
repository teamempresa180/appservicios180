import 'package:flutter/material.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_button.dart';
import '../../../../core/ui/widgets/app_card.dart';
import '../../../../core/ui/widgets/app_section_title.dart';
import '../../../../core/ui/widgets/app_text_field.dart';

/// Visual-only preview of what adding a new address would look like.
/// Purely a mock-up — "Guardar" is a no-op; it does not create a real
/// `Address` (no backend, no persistence, no real logic — see the
/// feature README).
class AddressFormPreview extends StatelessWidget {
  const AddressFormPreview({super.key, this.onSave});

  final VoidCallback? onSave;

  @override
  Widget build(BuildContext context) {
    return AppCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const AppSectionTitle(title: 'Agregar nueva dirección'),
          const AppTextField(label: 'Alias', hint: 'Casa, Trabajo...'),
          const SizedBox(height: AppSpacing.space8),
          const AppTextField(label: 'Dirección completa'),
          const SizedBox(height: AppSpacing.space8),
          const AppTextField(label: 'Ciudad'),
          const SizedBox(height: AppSpacing.space8),
          const AppTextField(label: 'Departamento'),
          const SizedBox(height: AppSpacing.space16),
          AppButton(label: 'Guardar', onPressed: onSave ?? () {}),
        ],
      ),
    );
  }
}
