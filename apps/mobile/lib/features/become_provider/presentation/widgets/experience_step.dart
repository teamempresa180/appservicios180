import 'package:flutter/material.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_button.dart';
import '../../../../core/ui/widgets/app_card.dart';
import '../../../../core/ui/widgets/app_text_field.dart';

/// Result of Paso 3 ("Experiencia"), handed back via [ExperienceStep
/// .onContinue] once the form validates.
class ExperienceStepResult {
  const ExperienceStepResult({
    required this.yearsOfExperience,
    required this.previousCompany,
    required this.isIndependent,
    required this.biography,
  });

  final int yearsOfExperience;
  final String? previousCompany;
  final bool isIndependent;
  final String biography;
}

/// Paso 3: years of experience (numeric), previous company (optional),
/// an independiente/empresa toggle, and a validated professional
/// description.
class ExperienceStep extends StatefulWidget {
  const ExperienceStep({
    super.key,
    required this.onContinue,
    this.initialYearsOfExperience,
    this.initialPreviousCompany,
    this.initialIsIndependent = true,
    this.initialBiography,
  });

  final ValueChanged<ExperienceStepResult> onContinue;
  final int? initialYearsOfExperience;
  final String? initialPreviousCompany;
  final bool initialIsIndependent;
  final String? initialBiography;

  static const int maxBiographyLength = 600;

  @override
  State<ExperienceStep> createState() => _ExperienceStepState();
}

class _ExperienceStepState extends State<ExperienceStep> {
  final _formKey = GlobalKey<FormState>();
  late final _yearsController = TextEditingController(
    text: widget.initialYearsOfExperience?.toString() ?? '',
  );
  late final _companyController = TextEditingController(
    text: widget.initialPreviousCompany ?? '',
  );
  late final _biographyController = TextEditingController(
    text: widget.initialBiography ?? '',
  );
  late bool _isIndependent = widget.initialIsIndependent;

  @override
  void dispose() {
    _yearsController.dispose();
    _companyController.dispose();
    _biographyController.dispose();
    super.dispose();
  }

  void _continue() {
    if (!(_formKey.currentState?.validate() ?? false)) return;
    widget.onContinue(
      ExperienceStepResult(
        yearsOfExperience: int.parse(_yearsController.text.trim()),
        previousCompany: _companyController.text.trim().isEmpty
            ? null
            : _companyController.text.trim(),
        isIndependent: _isIndependent,
        biography: _biographyController.text.trim(),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Form(
      key: _formKey,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          AppCard(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                AppTextField(
                  controller: _yearsController,
                  label: 'Años de experiencia',
                  keyboardType: TextInputType.number,
                  validator: (value) {
                    final parsed = int.tryParse(value?.trim() ?? '');
                    if (parsed == null || parsed < 0 || parsed > 80) {
                      return 'Ingresa un número válido de años.';
                    }
                    return null;
                  },
                ),
                const SizedBox(height: AppSpacing.space16),
                AppTextField(
                  controller: _companyController,
                  label: 'Empresa anterior (opcional)',
                  hint: 'Ej. Servicios Eléctricos S.A.S.',
                ),
                const SizedBox(height: AppSpacing.space16),
                SwitchListTile(
                  contentPadding: EdgeInsets.zero,
                  title: const Text('¿Trabajas de forma independiente?'),
                  value: _isIndependent,
                  onChanged: (value) => setState(() => _isIndependent = value),
                ),
                const SizedBox(height: AppSpacing.space8),
                AppTextField(
                  controller: _biographyController,
                  label: 'Descripción profesional',
                  hint: 'Cuéntales a tus clientes sobre tu experiencia',
                  maxLines: 5,
                  maxLength: ExperienceStep.maxBiographyLength,
                  validator: (value) => (value == null || value.trim().isEmpty)
                      ? 'La descripción es obligatoria.'
                      : null,
                ),
              ],
            ),
          ),
          const SizedBox(height: AppSpacing.space20),
          AppButton(label: 'Continuar', onPressed: _continue),
        ],
      ),
    );
  }
}
