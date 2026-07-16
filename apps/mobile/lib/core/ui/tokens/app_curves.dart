import 'package:flutter/animation.dart';

/// Official animation curve scale — Sprint 2 (Branding & UX), Etapa 1.
/// Names the curves `FadeIn`/`ScaleIn`/`SlideIn` already used as bare
/// `Curves.*` literals, so future animations reference a token instead
/// of picking a curve ad hoc. Values are unchanged from what those
/// three widgets already used — this is a naming pass, not a visual
/// change.
abstract final class AppCurves {
  /// Standard entrance/exit easing — a softer, more gradual deceleration
  /// than `Curves.easeOut` (Apple-style redesign: fewer abrupt stops).
  /// Used by `FadeIn` and `SlideIn`.
  static const Curve standard = Curves.easeOutCubic;

  /// Playful overshoot easing for emphasis entrances (e.g. a card
  /// popping into place). Used by `ScaleIn`.
  static const Curve playful = Curves.easeOutBack;
}
