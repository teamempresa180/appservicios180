import 'package:flutter/material.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_button.dart';
import '../../../../core/ui/widgets/app_text_field.dart';
import '../models/register_data.dart';
import '../validators/register_validators.dart';
import 'password_confirmation_field.dart';

/// Full name, email, password and password confirmation fields plus the
/// "Continuar" button. Purely local validation — [onSubmit] only fires
/// once the form passes validation. No API calls, no state management
/// beyond the form's own fields.
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
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _confirmController = TextEditingController();

  @override
  void dispose() {
    _nameController.dispose();
    _emailController.dispose();
    _passwordController.dispose();
    _confirmController.dispose();
    super.dispose();
  }

  void _handleSubmit() {
    if (!(_formKey.currentState?.validate() ?? false)) return;
    widget.onSubmit(
      RegisterData(
        fullName: _nameController.text.trim(),
        email: _emailController.text.trim(),
        password: _passwordController.text,
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
              validator: RegisterValidators.fullName,
            ),
          ),
          const SizedBox(height: AppSpacing.space16),
          Semantics(
            textField: true,
            label: 'Correo electrónico',
            hint: 'Ingresa tu correo electrónico',
            child: AppTextField(
              controller: _emailController,
              label: 'Correo electrónico',
              hint: 'Ingresa tu correo electrónico',
              keyboardType: TextInputType.emailAddress,
              enabled: !widget.isSubmitting,
              validator: RegisterValidators.email,
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
