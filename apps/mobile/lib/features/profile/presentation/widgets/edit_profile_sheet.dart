import 'package:flutter/material.dart';
import '../../../../core/ui/extensions/context_theme_extensions.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_button.dart';
import '../../../../core/ui/widgets/app_text_field.dart';

/// The fields [EditProfileSheet] collects and returns on save — every
/// field the app can actually persist today (see
/// `ProfileRepository.updateDisplayName`/`updatePhone`/`updateEmail`/
/// `updateAddress`). Document number/birth date aren't included: those
/// are identity-verified data in a real commercial app, not a
/// self-service edit.
class EditProfileResult {
  const EditProfileResult({
    required this.displayName,
    required this.phone,
    required this.email,
    required this.addressAlias,
    required this.fullAddress,
  });

  final String displayName;
  final String phone;
  final String email;
  final String addressAlias;
  final String fullAddress;
}

/// Bottom sheet form for "Editar perfil" — realistic day-to-day fields
/// for a commercial app: nombre, teléfono, correo y dirección (this
/// project's mock/HTTP repositories now genuinely persist all of
/// these, not just the display name). Returns an [EditProfileResult]
/// via [Navigator.pop], or `null` if the user cancels.
class EditProfileSheet extends StatefulWidget {
  const EditProfileSheet({
    super.key,
    required this.currentName,
    required this.currentPhone,
    required this.currentEmail,
    required this.currentAddressAlias,
    required this.currentFullAddress,
  });

  final String currentName;
  final String currentPhone;
  final String currentEmail;
  final String currentAddressAlias;
  final String currentFullAddress;

  static Future<EditProfileResult?> show(
    BuildContext context, {
    required String currentName,
    required String currentPhone,
    required String currentEmail,
    required String currentAddressAlias,
    required String currentFullAddress,
  }) {
    return showModalBottomSheet<EditProfileResult>(
      context: context,
      isScrollControlled: true,
      builder: (context) => EditProfileSheet(
        currentName: currentName,
        currentPhone: currentPhone,
        currentEmail: currentEmail,
        currentAddressAlias: currentAddressAlias,
        currentFullAddress: currentFullAddress,
      ),
    );
  }

  @override
  State<EditProfileSheet> createState() => _EditProfileSheetState();
}

class _EditProfileSheetState extends State<EditProfileSheet> {
  late final _nameController = TextEditingController(text: widget.currentName);
  late final _phoneController = TextEditingController(text: widget.currentPhone);
  late final _emailController = TextEditingController(text: widget.currentEmail);
  late final _addressAliasController = TextEditingController(
    text: widget.currentAddressAlias,
  );
  late final _fullAddressController = TextEditingController(
    text: widget.currentFullAddress,
  );
  final _formKey = GlobalKey<FormState>();

  @override
  void dispose() {
    _nameController.dispose();
    _phoneController.dispose();
    _emailController.dispose();
    _addressAliasController.dispose();
    _fullAddressController.dispose();
    super.dispose();
  }

  String? _requiredValidator(String? value) =>
      (value == null || value.trim().isEmpty) ? 'Este campo es obligatorio' : null;

  String? _emailValidator(String? value) {
    if (value == null || value.trim().isEmpty) return 'Ingresa un correo';
    final isValid = RegExp(r'^[^@\s]+@[^@\s]+\.[^@\s]+$').hasMatch(value.trim());
    return isValid ? null : 'Ingresa un correo válido';
  }

  String? _phoneValidator(String? value) {
    if (value == null || value.trim().isEmpty) return 'Ingresa un teléfono';
    final digits = value.replaceAll(RegExp(r'[^0-9]'), '');
    return digits.length >= 7 ? null : 'Ingresa un teléfono válido';
  }

  void _save() {
    if (!_formKey.currentState!.validate()) return;
    Navigator.of(context).pop(
      EditProfileResult(
        displayName: _nameController.text.trim(),
        phone: _phoneController.text.trim(),
        email: _emailController.text.trim(),
        addressAlias: _addressAliasController.text.trim(),
        fullAddress: _fullAddressController.text.trim(),
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
                'Editar perfil',
                style: context.textStyles.titleLarge,
              ),
              const SizedBox(height: AppSpacing.space16),
              AppTextField(
                controller: _nameController,
                label: 'Nombre para mostrar',
                prefixIcon: Icons.person_outline,
                validator: _requiredValidator,
              ),
              const SizedBox(height: AppSpacing.space12),
              AppTextField(
                controller: _phoneController,
                label: 'Teléfono',
                keyboardType: TextInputType.phone,
                prefixIcon: Icons.phone_outlined,
                validator: _phoneValidator,
              ),
              const SizedBox(height: AppSpacing.space12),
              AppTextField(
                controller: _emailController,
                label: 'Correo electrónico',
                keyboardType: TextInputType.emailAddress,
                prefixIcon: Icons.email_outlined,
                validator: _emailValidator,
              ),
              const SizedBox(height: AppSpacing.space12),
              AppTextField(
                controller: _addressAliasController,
                label: 'Alias de la dirección (Casa, Trabajo...)',
                prefixIcon: Icons.label_outline,
                validator: _requiredValidator,
              ),
              const SizedBox(height: AppSpacing.space12),
              AppTextField(
                controller: _fullAddressController,
                label: 'Dirección completa',
                prefixIcon: Icons.place_outlined,
                validator: _requiredValidator,
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
