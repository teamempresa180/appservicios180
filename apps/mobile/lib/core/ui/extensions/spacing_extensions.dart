import 'package:flutter/widgets.dart';

/// Turns a raw number (expected to be one of the `AppSpacing` tokens) into
/// layout gaps, so call sites read as `AppSpacing.space16.verticalGap`.
extension SpacingExtensions on double {
  SizedBox get verticalGap => SizedBox(height: this);
  SizedBox get horizontalGap => SizedBox(width: this);
}
