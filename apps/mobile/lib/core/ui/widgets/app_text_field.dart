import 'package:flutter/material.dart';

/// Generic, theme-driven text field. No domain knowledge — only the
/// standard text input concerns (label, hint, obscuring, validation).
///
/// Focus/error/disabled borders and content padding come from
/// `AppTheme.light.inputDecorationTheme` — this widget only supplies the
/// per-field content (label, hint, icons), so every field looks
/// consistent without repeating decoration code at each call site.
class AppTextField extends StatelessWidget {
  const AppTextField({
    super.key,
    this.controller,
    this.label,
    this.hint,
    this.obscureText = false,
    this.enabled = true,
    this.keyboardType,
    this.onChanged,
    this.validator,
    this.prefixIcon,
    this.suffixIcon,
  });

  final TextEditingController? controller;
  final String? label;
  final String? hint;
  final bool obscureText;
  final bool enabled;
  final TextInputType? keyboardType;
  final ValueChanged<String>? onChanged;
  final FormFieldValidator<String>? validator;

  /// Optional leading icon (Material Icons only).
  final IconData? prefixIcon;

  /// Optional trailing widget (e.g. a show/hide password `IconButton`).
  final Widget? suffixIcon;

  @override
  Widget build(BuildContext context) {
    return TextFormField(
      controller: controller,
      obscureText: obscureText,
      enabled: enabled,
      keyboardType: keyboardType,
      onChanged: onChanged,
      validator: validator,
      decoration: InputDecoration(
        labelText: label,
        hintText: hint,
        prefixIcon: prefixIcon == null ? null : Icon(prefixIcon),
        suffixIcon: suffixIcon,
      ),
    );
  }
}
