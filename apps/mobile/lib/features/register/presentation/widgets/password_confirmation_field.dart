import 'package:flutter/material.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_text_field.dart';
import '../validators/register_validators.dart';

/// "Confirmar contraseña" input built on top of [AppTextField], adding a
/// show/hide toggle (Material Icons only). Validates against the live
/// value of [passwordController] so it always compares to the current
/// password, not a stale copy.
class PasswordConfirmationField extends StatefulWidget {
  const PasswordConfirmationField({
    super.key,
    required this.controller,
    required this.passwordController,
    this.enabled = true,
  });

  final TextEditingController controller;
  final TextEditingController passwordController;
  final bool enabled;

  @override
  State<PasswordConfirmationField> createState() =>
      _PasswordConfirmationFieldState();
}

class _PasswordConfirmationFieldState extends State<PasswordConfirmationField> {
  bool _obscure = true;

  void _toggleObscure() => setState(() => _obscure = !_obscure);

  @override
  Widget build(BuildContext context) {
    return Semantics(
      textField: true,
      label: 'Confirmar contraseña',
      hint: 'Repite tu contraseña',
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          Expanded(
            child: AppTextField(
              controller: widget.controller,
              label: 'Confirmar contraseña',
              hint: 'Repite tu contraseña',
              obscureText: _obscure,
              enabled: widget.enabled,
              keyboardType: TextInputType.visiblePassword,
              validator: (value) => RegisterValidators.confirmPassword(
                value,
                widget.passwordController.text,
              ),
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
