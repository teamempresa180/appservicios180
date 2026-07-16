import 'package:google_fonts/google_fonts.dart';
import 'package:flutter/material.dart';

/// Official Servicios 180° type scale. Named after the five roles the
/// brand defines (Display, Headline, Title, Body, Label), each with
/// three sizes, mirroring how `ThemeData.textTheme` is already
/// structured so adopting this scale is a drop-in replacement, not a
/// restructuring.
///
/// **Typeface**: **Inter** throughout (one consistent family across all
/// roles, matching how Apple uses a single system font at different
/// weights instead of pairing two typefaces) — approved by the user for
/// the Apple-inspired redesign, replacing the previously
/// pending-approval Poppins/Roboto pairing. Loaded via `google_fonts`.
///
/// Wired into `AppTheme.light.textTheme` (each role recolored to
/// `colorScheme.onSurface`/`secondary600` there, since this file only
/// owns size/weight/spacing/family, never color).
abstract final class AppTypography {
  static TextStyle _inter({
    required double fontSize,
    required double height,
    required FontWeight fontWeight,
    double letterSpacing = 0,
  }) => GoogleFonts.inter(
    fontSize: fontSize,
    height: height / fontSize,
    fontWeight: fontWeight,
    letterSpacing: letterSpacing,
  );

  static final TextStyle displayLarge = _inter(
    fontSize: 57,
    height: 64,
    fontWeight: FontWeight.w700,
    letterSpacing: -0.5,
  );
  static final TextStyle displayMedium = _inter(
    fontSize: 45,
    height: 52,
    fontWeight: FontWeight.w700,
    letterSpacing: -0.25,
  );
  static final TextStyle displaySmall = _inter(
    fontSize: 36,
    height: 44,
    fontWeight: FontWeight.w700,
  );

  static final TextStyle headlineLarge = _inter(
    fontSize: 32,
    height: 40,
    fontWeight: FontWeight.w700,
  );
  static final TextStyle headlineMedium = _inter(
    fontSize: 28,
    height: 36,
    fontWeight: FontWeight.w600,
  );
  static final TextStyle headlineSmall = _inter(
    fontSize: 24,
    height: 32,
    fontWeight: FontWeight.w600,
  );

  static final TextStyle titleLarge = _inter(
    fontSize: 22,
    height: 28,
    fontWeight: FontWeight.w600,
  );
  static final TextStyle titleMedium = _inter(
    fontSize: 16,
    height: 24,
    fontWeight: FontWeight.w600,
    letterSpacing: 0.1,
  );
  static final TextStyle titleSmall = _inter(
    fontSize: 14,
    height: 20,
    fontWeight: FontWeight.w600,
    letterSpacing: 0.1,
  );

  static final TextStyle bodyLarge = _inter(
    fontSize: 16,
    height: 24,
    fontWeight: FontWeight.w400,
  );
  static final TextStyle bodyMedium = _inter(
    fontSize: 14,
    height: 20,
    fontWeight: FontWeight.w400,
  );
  static final TextStyle bodySmall = _inter(
    fontSize: 12,
    height: 16,
    fontWeight: FontWeight.w400,
  );

  static final TextStyle labelLarge = _inter(
    fontSize: 14,
    height: 20,
    fontWeight: FontWeight.w600,
    letterSpacing: 0.1,
  );
  static final TextStyle labelMedium = _inter(
    fontSize: 12,
    height: 16,
    fontWeight: FontWeight.w600,
    letterSpacing: 0.3,
  );
  static final TextStyle labelSmall = _inter(
    fontSize: 11,
    height: 16,
    fontWeight: FontWeight.w600,
    letterSpacing: 0.3,
  );
}
