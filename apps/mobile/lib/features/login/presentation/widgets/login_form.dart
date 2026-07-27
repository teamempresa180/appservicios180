import 'package:flutter/material.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_button.dart';
import '../../../../core/ui/widgets/app_text_field.dart';
import '../models/login_credentials.dart';
import '../validators/login_validators.dart';
import 'password_field.dart';

/// Document number + password fields and the "Continuar" button.
/// Purely local validation — [onSubmit] only fires once the form
/// passes validation. No API calls, no state management beyond the
/// form's own fields.
class LoginForm extends StatefulWidget {
  const LoginForm({
    super.key,
    required this.onSubmit,
    required this.isSubmitting,
  });

  final ValueChanged<LoginCredentials> onSubmit;
  final bool isSubmitting;

  @override
  State<LoginForm> createState() => _LoginFormState();
}

class _LoginFormState extends State<LoginForm> {
  final _formKey = GlobalKey<FormState>();
  final _documentNumberController = TextEditingController();
  final _passwordController = TextEditingController();

  @override
  void dispose() {
    _documentNumberController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  void _handleSubmit() {
    if (!(_formKey.currentState?.validate() ?? false)) return;
    widget.onSubmit(
      LoginCredentials(
        documentNumber: _documentNumberController.text.trim(),
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
            label: 'Número de documento',
            hint: 'Ingresa tu número de documento',
            child: AppTextField(
              controller: _documentNumberController,
              label: 'Número de documento',
              hint: 'Ingresa tu número de documento',
              keyboardType: TextInputType.text,
              enabled: !widget.isSubmitting,
              validator: LoginValidators.documentNumber,
            ),
          ),
          const SizedBox(height: AppSpacing.space16),
          PasswordField(
            controller: _passwordController,
            validator: LoginValidators.password,
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
