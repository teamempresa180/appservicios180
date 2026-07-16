import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'app_brand_palette.dart';
import 'app_typography.dart';
import '../tokens/app_elevation.dart';
import '../tokens/app_radius.dart';
import '../tokens/app_spacing.dart';

/// Single source of truth for the application's `ThemeData` — Servicios
/// 180° official branding (Sprint 2, Etapa 2). Every color comes from
/// `AppBrandPalette`; every text style from `AppTypography`. No screen
/// should ever need to change: they all resolve colors/type through
/// `Theme.of(context)` (see `context_theme_extensions.dart`), so this
/// file is the only place the brand is actually applied.
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

    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.light,
      fontFamily: GoogleFonts.inter().fontFamily,
      scaffoldBackgroundColor: AppBrandPalette.background50,
      colorScheme: colorScheme,
      dividerColor: AppBrandPalette.secondary200,
      dividerTheme: const DividerThemeData(
        color: AppBrandPalette.secondary200,
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
        bodySmall: AppTypography.bodySmall.copyWith(
          color: AppBrandPalette.secondary600,
        ),
        labelLarge: AppTypography.labelLarge.copyWith(
          color: colorScheme.onSurface,
        ),
        labelMedium: AppTypography.labelMedium.copyWith(
          color: AppBrandPalette.secondary600,
        ),
        labelSmall: AppTypography.labelSmall.copyWith(
          color: AppBrandPalette.secondary600,
        ),
      ),
      appBarTheme: AppBarTheme(
        backgroundColor: AppBrandPalette.background50,
        foregroundColor: colorScheme.onSurface,
        elevation: AppElevation.level0,
        surfaceTintColor: Colors.transparent,
      ),
      cardTheme: CardThemeData(
        color: AppBrandPalette.background50,
        elevation: AppElevation.level0,
        margin: EdgeInsets.zero,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(AppRadius.radius20),
          side: BorderSide(
            color: AppBrandPalette.secondary200.withValues(alpha: 0.6),
          ),
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: AppBrandPalette.surface300,
        contentPadding: const EdgeInsets.symmetric(
          horizontal: AppSpacing.space16,
          vertical: AppSpacing.space16,
        ),
        hintStyle: const TextStyle(color: AppBrandPalette.secondary600),
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
          borderSide: const BorderSide(color: AppBrandPalette.error500),
        ),
        focusedErrorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(AppRadius.radius16),
          borderSide: const BorderSide(
            color: AppBrandPalette.error500,
            width: 2,
          ),
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
          foregroundColor: AppBrandPalette.primary700,
          textStyle: AppTypography.labelLarge,
        ),
      ),
    );
  }
}
