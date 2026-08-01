import 'package:flutter/material.dart';
import '../../../../category/entities/category.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_button.dart';
import '../../../../core/ui/widgets/app_card.dart';
import '../../specialization/models/specialization.dart';
import 'specialization_picker.dart';

/// Paso 2 ("Especialización"): the existing `Category` dropdown plus
/// the (mock-backed today, swappable) [SpecializationPicker].
/// "Continuar" only enables once both are chosen.
class SpecializationStep extends StatefulWidget {
  const SpecializationStep({
    super.key,
    required this.categories,
    required this.selectedCategory,
    required this.onCategoryChanged,
    this.initialSpecializationId,
    required this.onSpecializationSelected,
    required this.onContinue,
  });

  final List<Category> categories;
  final Category? selectedCategory;
  final ValueChanged<Category> onCategoryChanged;
  final String? initialSpecializationId;
  final ValueChanged<Specialization> onSpecializationSelected;
  final VoidCallback onContinue;

  @override
  State<SpecializationStep> createState() => _SpecializationStepState();
}

class _SpecializationStepState extends State<SpecializationStep> {
  Specialization? _specialization;

  @override
  Widget build(BuildContext context) {
    final category = widget.selectedCategory;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        AppCard(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              DropdownButtonFormField<Category>(
                initialValue: category,
                isExpanded: true,
                decoration: const InputDecoration(
                  labelText: 'Categoría principal',
                ),
                items: [
                  for (final c in widget.categories)
                    DropdownMenuItem(value: c, child: Text(c.name)),
                ],
                onChanged: (value) {
                  if (value == null) return;
                  setState(() => _specialization = null);
                  widget.onCategoryChanged(value);
                },
              ),
              const SizedBox(height: AppSpacing.space16),
              if (category != null)
                SpecializationPicker(
                  key: ValueKey(category.id.value),
                  categoryId: category.id,
                  initialSpecializationId: widget.initialSpecializationId,
                  onSelected: (specialization) {
                    setState(() => _specialization = specialization);
                    widget.onSpecializationSelected(specialization);
                  },
                ),
            ],
          ),
        ),
        const SizedBox(height: AppSpacing.space20),
        AppButton(
          label: 'Continuar',
          onPressed: (category != null && _specialization != null)
              ? widget.onContinue
              : null,
        ),
      ],
    );
  }
}
