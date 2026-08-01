import 'package:flutter/material.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_button.dart';
import '../../../../core/ui/widgets/app_text_field.dart';
import '../../../../identity/models/document_type.dart';
import '../models/register_data.dart';
import '../validators/register_validators.dart';
import 'password_confirmation_field.dart';

String documentTypeLabel(DocumentType type) {
  switch (type) {
    case DocumentType.nationalId:
      return 'Cédula de ciudadanía';
    case DocumentType.passport:
      return 'Pasaporte';
    case DocumentType.foreignId:
      return 'Cédula de extranjería';
    case DocumentType.taxId:
      return 'NIT';
    case DocumentType.other:
      return 'Otro';
  }
}

/// Full name, document type/number, birth date, password and password
/// confirmation fields plus the "Continuar" button. Purely local
/// validation — [onSubmit] only fires once the form passes validation.
/// No API calls, no state management beyond the form's own fields.
class RegisterForm extends StatefulWidget {
  const RegisterForm({
    super.key,
    required this.onSubmit,
    required this.isSubmitting,
  });

  final ValueChanged<RegisterData> onSubmit;
  final bool isSubmitting;

  @override
  State<RegisterForm> createState() => _RegisterFormState();
}

class _RegisterFormState extends State<RegisterForm> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _documentNumberController = TextEditingController();
  final _passwordController = TextEditingController();
  final _confirmController = TextEditingController();
  DocumentType _documentType = DocumentType.nationalId;
  DateTime? _birthDate;
  String? _birthDateError;

  @override
  void dispose() {
    _nameController.dispose();
    _documentNumberController.dispose();
    _passwordController.dispose();
    _confirmController.dispose();
    super.dispose();
  }

  Future<void> _pickBirthDate() async {
    final now = DateTime.now();
    final picked = await showDatePicker(
      context: context,
      initialDate: DateTime(now.year - 18, now.month, now.day),
      firstDate: DateTime(now.year - 100),
      lastDate: now,
    );
    if (picked != null) {
      setState(() {
        _birthDate = picked;
        _birthDateError = null;
      });
    }
  }

  void _handleSubmit() {
    final formValid = _formKey.currentState?.validate() ?? false;
    final birthDate = _birthDate;
    setState(() {
      _birthDateError = birthDate == null
          ? 'La fecha de nacimiento es obligatoria.'
          : null;
    });
    if (!formValid || birthDate == null) return;
    widget.onSubmit(
      RegisterData(
        fullName: _nameController.text.trim(),
        documentType: _documentType,
        documentNumber: _documentNumberController.text.trim(),
        birthDate: birthDate,
        password: _passwordController.text,
      ),
    );
  }

  String _formatDate(DateTime date) {
    final day = date.day.toString().padLeft(2, '0');
    final month = date.month.toString().padLeft(2, '0');
    return '$day/$month/${date.year}';
  }

  @override
  Widget build(BuildContext context) {
    return Form(
      key: _formKey,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Semantics(
            textField: true,
            label: 'Nombre completo',
            hint: 'Ingresa tu nombre completo',
            child: AppTextField(
              controller: _nameController,
              label: 'Nombre completo',
              hint: 'Ingresa tu nombre completo',
              keyboardType: TextInputType.name,
              enabled: !widget.isSubmitting,
              maxLength: RegisterValidators.maxFullNameLength,
              validator: RegisterValidators.fullName,
            ),
          ),
          const SizedBox(height: AppSpacing.space16),
          DropdownButtonFormField<DocumentType>(
            initialValue: _documentType,
            decoration: const InputDecoration(
              labelText: 'Tipo de documento',
            ),
            isExpanded: true,
            items: [
              for (final type in DocumentType.values)
                DropdownMenuItem(
                  value: type,
                  child: Text(documentTypeLabel(type)),
                ),
            ],
            onChanged: widget.isSubmitting
                ? null
                : (value) {
                    if (value != null) setState(() => _documentType = value);
                  },
          ),
          const SizedBox(height: AppSpacing.space16),
          Semantics(
            textField: true,
            label: 'Número de documento',
            hint: 'Ingresa tu número de documento',
            child: AppTextField(
              controller: _documentNumberController,
              label: 'Número de documento',
              hint: 'Ingresa tu número de documento',
              keyboardType: TextInputType.text,
              enabled: !widget.isSubmitting,
              maxLength: RegisterValidators.maxDocumentNumberLength,
              validator: RegisterValidators.documentNumber,
            ),
          ),
          const SizedBox(height: AppSpacing.space16),
          InkWell(
            onTap: widget.isSubmitting ? null : _pickBirthDate,
            child: InputDecorator(
              decoration: InputDecoration(
                labelText: 'Fecha de nacimiento',
                errorText: _birthDateError,
              ),
              child: Text(
                _birthDate == null
                    ? 'Selecciona tu fecha de nacimiento'
                    : _formatDate(_birthDate!),
              ),
            ),
          ),
          const SizedBox(height: AppSpacing.space16),
          _PasswordInput(
            controller: _passwordController,
            enabled: !widget.isSubmitting,
          ),
          const SizedBox(height: AppSpacing.space16),
          PasswordConfirmationField(
            controller: _confirmController,
            passwordController: _passwordController,
            enabled: !widget.isSubmitting,
          ),
          const SizedBox(height: AppSpacing.space24),
          AppButton(
            label: 'Continuar',
            isLoading: widget.isSubmitting,
            onPressed: widget.isSubmitting ? null : _handleSubmit,
          ),
        ],
      ),
    );
  }
}

/// Private "Contraseña" field with a show/hide toggle (Material Icons
/// only), local to [RegisterForm]. The other reusable password widget of
/// this feature, [PasswordConfirmationField], lives in its own file
/// because it also needs to compare against this field's live value.
class _PasswordInput extends StatefulWidget {
  const _PasswordInput({required this.controller, required this.enabled});

  final TextEditingController controller;
  final bool enabled;

  @override
  State<_PasswordInput> createState() => _PasswordInputState();
}

class _PasswordInputState extends State<_PasswordInput> {
  bool _obscure = true;

  void _toggleObscure() => setState(() => _obscure = !_obscure);

  @override
  Widget build(BuildContext context) {
    return Semantics(
      textField: true,
      label: 'Contraseña',
      hint: 'Ingresa tu contraseña',
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          Expanded(
            child: AppTextField(
              controller: widget.controller,
              label: 'Contraseña',
              hint: 'Ingresa tu contraseña',
              obscureText: _obscure,
              enabled: widget.enabled,
              keyboardType: TextInputType.visiblePassword,
              validator: RegisterValidators.password,
            ),
          ),
          const SizedBox(width: AppSpacing.space4),
          Semantics(
            button: true,
            label: _obscure ? 'Mostrar contraseña' : 'Ocultar contraseña',
            child: IconButton(
              onPressed: widget.enabled ? _toggleObscure : null,
              tooltip: _obscure ? 'Mostrar contraseña' : 'Ocultar contraseña',
              icon: Icon(
                _obscure
                    ? Icons.visibility_outlined
                    : Icons.visibility_off_outlined,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
