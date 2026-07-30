import 'package:flutter/material.dart';
import '../../../../core/ui/extensions/context_theme_extensions.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_button.dart';
import '../../../../core/ui/widgets/app_text_field.dart';

/// What [SubmitQuoteSheet] collects — passed straight through to
/// `OrdersRepository.submitQuote` (price, estimated duration in
/// minutes, and a free-text note). `QuoteType` isn't asked here: it
/// isn't meaningful for the provider to choose in this flow, so it's
/// defaulted to `QuoteType.standard` by the caller instead of adding a
/// selector for a distinction this screen has no use for yet.
class SubmitQuoteResult {
  const SubmitQuoteResult({
    required this.proposedPrice,
    required this.estimatedDuration,
    required this.notes,
  });

  final num proposedPrice;
  final int estimatedDuration;
  final String notes;
}

/// Bottom sheet form for a provider to submit a `Quote` in response to
/// a client's request — the replacement for the old, obsolete
/// "Aceptar" (direct order-acceptance) action, which the real backend
/// no longer supports (see `ProviderRequestsViewModel`'s class doc).
/// Same shape as `ServiceFormSheet`: a `Form` with validated
/// `AppTextField`s, returning a result via `Navigator.pop`, or `null`
/// if the user cancels.
class SubmitQuoteSheet extends StatefulWidget {
  const SubmitQuoteSheet({super.key});

  static Future<SubmitQuoteResult?> show(BuildContext context) {
    return showModalBottomSheet<SubmitQuoteResult>(
      context: context,
      isScrollControlled: true,
      builder: (context) => const SubmitQuoteSheet(),
    );
  }

  @override
  State<SubmitQuoteSheet> createState() => _SubmitQuoteSheetState();
}

class _SubmitQuoteSheetState extends State<SubmitQuoteSheet> {
  final _priceController = TextEditingController();
  final _durationController = TextEditingController(text: '60');
  final _notesController = TextEditingController();
  final _formKey = GlobalKey<FormState>();

  @override
  void dispose() {
    _priceController.dispose();
    _durationController.dispose();
    _notesController.dispose();
    super.dispose();
  }

  String? _requiredValidator(String? value) =>
      (value == null || value.trim().isEmpty)
      ? 'Este campo es obligatorio'
      : null;

  String? _numberValidator(String? value) {
    if (value == null || value.trim().isEmpty) {
      return 'Este campo es obligatorio';
    }
    return num.tryParse(value.trim()) == null
        ? 'Ingresa un número válido'
        : null;
  }

  String? _durationValidator(String? value) {
    if (value == null || value.trim().isEmpty) {
      return 'Este campo es obligatorio';
    }
    return int.tryParse(value.trim()) == null
        ? 'Ingresa un número entero de minutos'
        : null;
  }

  void _submit() {
    if (!_formKey.currentState!.validate()) return;
    Navigator.of(context).pop(
      SubmitQuoteResult(
        proposedPrice: num.parse(_priceController.text.trim()),
        estimatedDuration: int.parse(_durationController.text.trim()),
        notes: _notesController.text.trim(),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.only(
        left: AppSpacing.space20,
        right: AppSpacing.space20,
        top: AppSpacing.space20,
        bottom: MediaQuery.of(context).viewInsets.bottom + AppSpacing.space20,
      ),
      child: SingleChildScrollView(
        child: Form(
          key: _formKey,
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Text(
                'Enviar cotización',
                style: context.textStyles.titleLarge,
              ),
              const SizedBox(height: AppSpacing.space16),
              AppTextField(
                controller: _priceController,
                label: 'Precio propuesto',
                keyboardType: TextInputType.number,
                prefixIcon: Icons.attach_money,
                validator: _numberValidator,
              ),
              const SizedBox(height: AppSpacing.space12),
              AppTextField(
                controller: _durationController,
                label: 'Duración estimada (minutos)',
                keyboardType: TextInputType.number,
                prefixIcon: Icons.timer_outlined,
                validator: _durationValidator,
              ),
              const SizedBox(height: AppSpacing.space12),
              AppTextField(
                controller: _notesController,
                label: 'Notas para el cliente',
                prefixIcon: Icons.notes_outlined,
                validator: _requiredValidator,
              ),
              const SizedBox(height: AppSpacing.space20),
              AppButton(label: 'Enviar cotización', onPressed: _submit),
              const SizedBox(height: AppSpacing.space8),
              AppButton(
                label: 'Cancelar',
                variant: AppButtonVariant.text,
                onPressed: () => Navigator.of(context).pop(),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
