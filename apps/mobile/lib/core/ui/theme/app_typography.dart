import 'package:flutter/material.dart';

/// Official Servicios 180° type scale — Sprint 2 (Branding & UX),
/// Etapa 1. Named after the five roles the brand defines (Display,
/// Headline, Title, Body, Label), each with three sizes, mirroring how
/// `ThemeData.textTheme` is already structured so adopting this scale
/// later is a drop-in replacement, not a restructuring.
///
/// **Typeface decision**: the logo's wordmark uses "Arial Rounded MT
/// Bold", a proprietary font not distributable with the app. The
/// official pairing chosen for Servicios 180° is **Poppins** (Display/
/// Headline/Title — geometric, warm, matches the logo's rounded
/// character) with **Roboto** (Body/Label — already in place, highest
/// legibility for dense lists). Adding Poppins requires either the
/// `google_fonts` package or bundling font assets — a dependency/asset
/// change the project's own rule requires explicit user approval for
/// (see `core/ui/README.md`, "No agregar paquetes externos... sin
/// aprobación explícita del usuario"). Until that approval, every
/// style below uses `fontFamily: null` (inherits the system default,
/// Roboto) — the weight/size/letter-spacing decisions are final, only
/// the Display/Headline/Title typeface swap is deferred.
///
/// **Not wired into `AppTheme.light.textTheme` yet** — see
/// `app_brand_palette.dart` for why (the whole brand rollout is a
/// later Sprint 2 Etapa).
abstract final class AppTypography {
  static const String? _pendingApprovalDisplayFontFamily = null;

  static const TextStyle displayLarge = TextStyle(
    fontFamily: _pendingApprovalDisplayFontFamily,
    fontSize: 57,
    height: 64 / 57,
    fontWeight: FontWeight.w400,
    letterSpacing: -0.25,
  );
  static const TextStyle displayMedium = TextStyle(
    fontFamily: _pendingApprovalDisplayFontFamily,
    fontSize: 45,
    height: 52 / 45,
    fontWeight: FontWeight.w400,
  );
  static const TextStyle displaySmall = TextStyle(
    fontFamily: _pendingApprovalDisplayFontFamily,
    fontSize: 36,
    height: 44 / 36,
    fontWeight: FontWeight.w400,
  );

  static const TextStyle headlineLarge = TextStyle(
    fontFamily: _pendingApprovalDisplayFontFamily,
    fontSize: 32,
    height: 40 / 32,
    fontWeight: FontWeight.w600,
  );
  static const TextStyle headlineMedium = TextStyle(
    fontFamily: _pendingApprovalDisplayFontFamily,
    fontSize: 28,
    height: 36 / 28,
    fontWeight: FontWeight.w600,
  );
  static const TextStyle headlineSmall = TextStyle(
    fontFamily: _pendingApprovalDisplayFontFamily,
    fontSize: 24,
    height: 32 / 24,
    fontWeight: FontWeight.w600,
  );

  static const TextStyle titleLarge = TextStyle(
    fontFamily: _pendingApprovalDisplayFontFamily,
    fontSize: 22,
    height: 28 / 22,
    fontWeight: FontWeight.w600,
  );
  static const TextStyle titleMedium = TextStyle(
    fontSize: 16,
    height: 24 / 16,
    fontWeight: FontWeight.w600,
    letterSpacing: 0.15,
  );
  static const TextStyle titleSmall = TextStyle(
    fontSize: 14,
    height: 20 / 14,
    fontWeight: FontWeight.w600,
    letterSpacing: 0.1,
  );

  static const TextStyle bodyLarge = TextStyle(
    fontSize: 16,
    height: 24 / 16,
    fontWeight: FontWeight.w400,
    letterSpacing: 0.5,
  );
  static const TextStyle bodyMedium = TextStyle(
    fontSize: 14,
    height: 20 / 14,
    fontWeight: FontWeight.w400,
    letterSpacing: 0.25,
  );
  static const TextStyle bodySmall = TextStyle(
    fontSize: 12,
    height: 16 / 12,
    fontWeight: FontWeight.w400,
    letterSpacing: 0.4,
  );

  static const TextStyle labelLarge = TextStyle(
    fontSize: 14,
    height: 20 / 14,
    fontWeight: FontWeight.w600,
    letterSpacing: 0.1,
  );
  static const TextStyle labelMedium = TextStyle(
    fontSize: 12,
    height: 16 / 12,
    fontWeight: FontWeight.w600,
    letterSpacing: 0.5,
  );
  static const TextStyle labelSmall = TextStyle(
    fontSize: 11,
    height: 16 / 11,
    fontWeight: FontWeight.w600,
    letterSpacing: 0.5,
  );
}
