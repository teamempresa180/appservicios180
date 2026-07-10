import 'package:flutter/material.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_text_field.dart';

/// Password input built on top of [AppTextField], adding a show/hide
/// toggle (Material Icons only). No new Core UI widget is introduced —
/// this composes the existing one.
class PasswordField extends StatefulWidget {
  const PasswordField({
    super.key,
    required this.controller,
    this.label = 'Contraseña',
    this.hint = 'Ingresa tu contraseña',
    this.validator,
    this.enabled = true,
  });

  final TextEditingController controller;
  final String label;
  final String? hint;
  final FormFieldValidator<String>? validator;
  final bool enabled;

  @override
  State<PasswordField> createState() => _PasswordFieldState();
}

class _PasswordFieldState extends State<PasswordField> {
  bool _obscure = true;

  void _toggleObscure() => setState(() => _obscure = !_obscure);

  @override
  Widget build(BuildContext context) {
    return Semantics(
      textField: true,
      label: widget.label,
      hint: widget.hint,
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          Expanded(
            child: AppTextField(
              controller: widget.controller,
              label: widget.label,
              hint: widget.hint,
              obscureText: _obscure,
              enabled: widget.enabled,
              keyboardType: TextInputType.visiblePassword,
              validator: widget.validator,
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
