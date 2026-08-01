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
    this.maxLines = 1,
    this.maxLength,
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

  /// Defaults to `1` (a single-line field, every existing call site's
  /// behavior). Set higher for a multi-line field (e.g. a
  /// professional description) — Flutter's `TextFormField` grows to
  /// fit up to this many lines rather than scrolling internally.
  final int maxLines;

  /// Optional live character counter + hard cap, shown under the field
  /// by Flutter's own `TextFormField` — `null` (the default) shows no
  /// counter and no cap.
  final int? maxLength;

  @override
  Widget build(BuildContext context) {
    return TextFormField(
      controller: controller,
      obscureText: obscureText,
      enabled: enabled,
      keyboardType: keyboardType,
      onChanged: onChanged,
      validator: validator,
      maxLines: maxLines,
      maxLength: maxLength,
      decoration: InputDecoration(
        labelText: label,
        hintText: hint,
        prefixIcon: prefixIcon == null ? null : Icon(prefixIcon),
        suffixIcon: suffixIcon,
      ),
    );
  }
}
