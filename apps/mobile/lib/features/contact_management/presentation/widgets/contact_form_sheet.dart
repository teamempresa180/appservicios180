import 'package:flutter/material.dart';
import '../../../../contact/models/contact_type.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_button.dart';
import '../../../../core/ui/widgets/app_text_field.dart';

class ContactFormResult {
  const ContactFormResult({required this.value, this.type});

  final String value;

  /// Only set in create mode — `type` isn't updatable (see
  /// `updateContact`'s doc comment).
  final ContactType? type;
}

String contactTypeLabel(ContactType type) {
  switch (type) {
    case ContactType.email:
      return 'Correo';
    case ContactType.phone:
      return 'Teléfono';
    case ContactType.other:
      return 'Otro';
  }
}

/// Bottom sheet form for creating or editing a [Contact]. In create
/// mode a [ContactType] dropdown is shown; in edit mode only the value
/// is editable. Returns a [ContactFormResult] via [Navigator.pop], or
/// `null` if the user cancels.
class ContactFormSheet extends StatefulWidget {
  const ContactFormSheet({
    super.key,
    this.isEditing = false,
    this.initialValue = '',
    this.initialType = ContactType.email,
  });

  final bool isEditing;
  final String initialValue;
  final ContactType initialType;

  static Future<ContactFormResult?> show(
    BuildContext context, {
    bool isEditing = false,
    String initialValue = '',
    ContactType initialType = ContactType.email,
  }) {
    return showModalBottomSheet<ContactFormResult>(
      context: context,
      isScrollControlled: true,
      builder: (context) => ContactFormSheet(
        isEditing: isEditing,
        initialValue: initialValue,
        initialType: initialType,
      ),
    );
  }

  @override
  State<ContactFormSheet> createState() => _ContactFormSheetState();
}

class _ContactFormSheetState extends State<ContactFormSheet> {
  late final _valueController = TextEditingController(text: widget.initialValue);
  late ContactType _type = widget.initialType;
  final _formKey = GlobalKey<FormState>();

  @override
  void dispose() {
    _valueController.dispose();
    super.dispose();
  }

  ContactType get _effectiveType =>
      widget.isEditing ? widget.initialType : _type;

  String? _validator(String? value) {
    if (value == null || value.trim().isEmpty) return 'Este campo es obligatorio';
    final trimmed = value.trim();
    // Guards the backend's own column limit up front, so an over-long
    // paste fails here with a clear message instead of as a generic
    // save error after a round trip.
    if (trimmed.length > 120) return 'Máximo 120 caracteres';
    switch (_effectiveType) {
      case ContactType.email:
        final isValid = RegExp(
          r'^[^@\s]+@[^@\s]+\.[^@\s]+$',
        ).hasMatch(trimmed);
        if (!isValid) return 'Ingresa un correo válido';
      case ContactType.phone:
        // Accepts digits with optional leading "+" and spaces/dashes
        // (e.g. "+57 300 123 4567") — only checks there are enough
        // digits, doesn't assume a specific country format.
        final digitCount = trimmed.replaceAll(RegExp(r'[^0-9]'), '').length;
        final isValid =
            RegExp(r'^\+?[0-9\s\-()]+$').hasMatch(trimmed) && digitCount >= 7;
        if (!isValid) return 'Ingresa un teléfono válido';
      case ContactType.other:
        break;
    }
    return null;
  }

  String get _valueLabel {
    switch (_effectiveType) {
      case ContactType.email:
        return 'Correo electrónico';
      case ContactType.phone:
        return 'Teléfono';
      case ContactType.other:
        return 'Valor';
    }
  }

  TextInputType get _keyboardType {
    switch (_effectiveType) {
      case ContactType.email:
        return TextInputType.emailAddress;
      case ContactType.phone:
        return TextInputType.phone;
      case ContactType.other:
        return TextInputType.text;
    }
  }

  void _save() {
    if (!_formKey.currentState!.validate()) return;
    Navigator.of(context).pop(
      ContactFormResult(
        value: _valueController.text.trim(),
        type: widget.isEditing ? null : _type,
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
                widget.isEditing ? 'Editar contacto' : 'Agregar contacto',
                style: Theme.of(context).textTheme.titleLarge,
              ),
              const SizedBox(height: AppSpacing.space16),
              if (!widget.isEditing) ...[
                DropdownButtonFormField<ContactType>(
                  initialValue: _type,
                  decoration: const InputDecoration(labelText: 'Tipo'),
                  items: [
                    for (final type in ContactType.values)
                      DropdownMenuItem(
                        value: type,
                        child: Text(contactTypeLabel(type)),
                      ),
                  ],
                  onChanged: (value) {
                    if (value != null) setState(() => _type = value);
                  },
                ),
                const SizedBox(height: AppSpacing.space12),
              ],
              AppTextField(
                controller: _valueController,
                label: _valueLabel,
                keyboardType: _keyboardType,
                prefixIcon: Icons.contact_mail_outlined,
                maxLength: 120,
                validator: _validator,
              ),
              const SizedBox(height: AppSpacing.space20),
              AppButton(label: 'Guardar', onPressed: _save),
            ],
          ),
        ),
      ),
    );
  }
}
