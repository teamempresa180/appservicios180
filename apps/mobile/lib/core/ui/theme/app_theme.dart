import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'app_brand_palette.dart';
import 'app_typography.dart';
import '../tokens/app_elevation.dart';
import '../tokens/app_radius.dart';
import '../tokens/app_spacing.dart';

/// Single source of truth for the application's `ThemeData` — Servicios
/// 180° official branding. Every color comes from `AppBrandPalette`;
/// every text style from `AppTypography`. No screen should ever need to
/// change: they all resolve colors/type through `Theme.of(context)`
/// (see `context_theme_extensions.dart`), so this file is the only
/// place the brand is actually applied.
///
/// [light] and [dark] share every structural decision (radii, spacing,
/// component shapes) via [_themeFrom] — only the color inputs differ,
/// so the two modes can never drift into inconsistent shapes/behavior.
abstract final class AppTheme {
  static ThemeData get light {
    final colorScheme = ColorScheme.light(
      primary: AppBrandPalette.primary500,
      onPrimary: AppBrandPalette.ink,
      primaryContainer: AppBrandPalette.primary100,
      onPrimaryContainer: AppBrandPalette.primary900,
      secondary: AppBrandPalette.secondary500,
      onSecondary: AppBrandPalette.ink,
      secondaryContainer: AppBrandPalette.secondary100,
      onSecondaryContainer: AppBrandPalette.ink,
      tertiary: AppBrandPalette.accent500,
      onTertiary: AppBrandPalette.ink,
      tertiaryContainer: AppBrandPalette.accent100,
      onTertiaryContainer: AppBrandPalette.accent900,
      surface: AppBrandPalette.background50,
      onSurface: AppBrandPalette.ink,
      error: AppBrandPalette.error500,
      onError: AppBrandPalette.background50,
      errorContainer: AppBrandPalette.error100,
      onErrorContainer: AppBrandPalette.error900,
      outline: AppBrandPalette.secondary300,
      outlineVariant: AppBrandPalette.secondary200,
    );

    return _themeFrom(
      colorScheme: colorScheme,
      scaffoldBackground: AppBrandPalette.background50,
      cardColor: AppBrandPalette.background50,
      cardBorder: AppBrandPalette.secondary200.withValues(alpha: 0.6),
      inputFill: AppBrandPalette.surface300,
      dividerColor: AppBrandPalette.secondary200,
      secondaryTextColor: AppBrandPalette.secondary600,
    );
  }

  /// Black background, white text, gold accents — approved by the user
  /// as the app's dark mode. Deliberately true black/white (not the
  /// warm-tinted `background600-900` stops), matching the "blanco,
  /// negro y dorado" brief exactly.
  static ThemeData get dark {
    final colorScheme = ColorScheme.dark(
      primary: AppBrandPalette.primary500,
      onPrimary: AppBrandPalette.ink,
      primaryContainer: AppBrandPalette.primary500.withValues(alpha: 0.24),
      onPrimaryContainer: AppBrandPalette.primary200,
      secondary: AppBrandPalette.secondary400,
      onSecondary: AppBrandPalette.ink,
      secondaryContainer: AppBrandPalette.darkSurfaceElevated,
      onSecondaryContainer: AppBrandPalette.darkOnBackground,
      tertiary: AppBrandPalette.accent400,
      onTertiary: AppBrandPalette.ink,
      tertiaryContainer: AppBrandPalette.accent500.withValues(alpha: 0.24),
      onTertiaryContainer: AppBrandPalette.accent200,
      surface: AppBrandPalette.darkBackground,
      onSurface: AppBrandPalette.darkOnBackground,
      error: AppBrandPalette.error400,
      onError: AppBrandPalette.ink,
      errorContainer: AppBrandPalette.error500.withValues(alpha: 0.24),
      onErrorContainer: AppBrandPalette.error200,
      outline: AppBrandPalette.darkDivider,
      outlineVariant: AppBrandPalette.darkDivider,
    );

    return _themeFrom(
      colorScheme: colorScheme,
      scaffoldBackground: AppBrandPalette.darkBackground,
      cardColor: AppBrandPalette.darkSurface,
      cardBorder: AppBrandPalette.darkDivider,
      inputFill: AppBrandPalette.darkSurfaceElevated,
      dividerColor: AppBrandPalette.darkDivider,
      secondaryTextColor: AppBrandPalette.darkSecondaryText,
    );
  }

  static ThemeData _themeFrom({
    required ColorScheme colorScheme,
    required Color scaffoldBackground,
    required Color cardColor,
    required Color cardBorder,
    required Color inputFill,
    required Color dividerColor,
    required Color secondaryTextColor,
  }) {
    return ThemeData(
      useMaterial3: true,
      brightness: colorScheme.brightness,
      fontFamily: GoogleFonts.inter().fontFamily,
      scaffoldBackgroundColor: scaffoldBackground,
      colorScheme: colorScheme,
      dividerColor: dividerColor,
      dividerTheme: DividerThemeData(
        color: dividerColor,
        thickness: 1,
        space: 1,
      ),
      textTheme: TextTheme(
        displayLarge: AppTypography.displayLarge.copyWith(
          color: colorScheme.onSurface,
        ),
        displayMedium: AppTypography.displayMedium.copyWith(
          color: colorScheme.onSurface,
        ),
        displaySmall: AppTypography.displaySmall.copyWith(
          color: colorScheme.onSurface,
        ),
        headlineLarge: AppTypography.headlineLarge.copyWith(
          color: colorScheme.onSurface,
        ),
        headlineMedium: AppTypography.headlineMedium.copyWith(
          color: colorScheme.onSurface,
        ),
        headlineSmall: AppTypography.headlineSmall.copyWith(
          color: colorScheme.onSurface,
        ),
        titleLarge: AppTypography.titleLarge.copyWith(
          color: colorScheme.onSurface,
        ),
        titleMedium: AppTypography.titleMedium.copyWith(
          color: colorScheme.onSurface,
        ),
        titleSmall: AppTypography.titleSmall.copyWith(
          color: colorScheme.onSurface,
        ),
        bodyLarge: AppTypography.bodyLarge.copyWith(
          color: colorScheme.onSurface,
        ),
        bodyMedium: AppTypography.bodyMedium.copyWith(
          color: colorScheme.onSurface,
        ),
        bodySmall: AppTypography.bodySmall.copyWith(color: secondaryTextColor),
        labelLarge: AppTypography.labelLarge.copyWith(
          color: colorScheme.onSurface,
        ),
        labelMedium: AppTypography.labelMedium.copyWith(
          color: secondaryTextColor,
        ),
        labelSmall: AppTypography.labelSmall.copyWith(
          color: secondaryTextColor,
        ),
      ),
      appBarTheme: AppBarTheme(
        backgroundColor: scaffoldBackground,
        foregroundColor: colorScheme.onSurface,
        elevation: AppElevation.level0,
        surfaceTintColor: Colors.transparent,
      ),
      cardTheme: CardThemeData(
        color: cardColor,
        elevation: AppElevation.level0,
        margin: EdgeInsets.zero,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(AppRadius.radius20),
          side: BorderSide(color: cardBorder),
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: inputFill,
        contentPadding: const EdgeInsets.symmetric(
          horizontal: AppSpacing.space16,
          vertical: AppSpacing.space16,
        ),
        hintStyle: TextStyle(color: secondaryTextColor),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(AppRadius.radius16),
          borderSide: BorderSide.none,
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(AppRadius.radius16),
          borderSide: BorderSide.none,
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(AppRadius.radius16),
          borderSide: const BorderSide(
            color: AppBrandPalette.primary500,
            width: 2,
          ),
        ),
        errorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(AppRadius.radius16),
          borderSide: BorderSide(color: colorScheme.error),
        ),
        focusedErrorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(AppRadius.radius16),
          borderSide: BorderSide(color: colorScheme.error, width: 2),
        ),
        disabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(AppRadius.radius16),
          borderSide: BorderSide.none,
        ),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: AppBrandPalette.primary500,
          foregroundColor: AppBrandPalette.ink,
          disabledBackgroundColor: AppBrandPalette.secondary200,
          disabledForegroundColor: AppBrandPalette.secondary500,
          elevation: 0,
          padding: const EdgeInsets.symmetric(vertical: AppSpacing.space16),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(AppRadius.radius16),
          ),
          textStyle: AppTypography.labelLarge,
        ),
      ),
      textButtonTheme: TextButtonThemeData(
        style: TextButton.styleFrom(
          foregroundColor: colorScheme.brightness == Brightness.dark
              ? AppBrandPalette.primary400
              : AppBrandPalette.primary700,
          textStyle: AppTypography.labelLarge,
        ),
      ),
    );
  }
}
