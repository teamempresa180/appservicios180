import 'package:flutter/material.dart';

/// Shorthand accessors so widgets don't repeat `Theme.of(context)...`.
/// Purely presentational plumbing — no domain meaning.
extension ContextThemeExtensions on BuildContext {
  ThemeData get theme => Theme.of(this);
  TextTheme get textStyles => Theme.of(this).textTheme;
  ColorScheme get colors => Theme.of(this).colorScheme;
}
