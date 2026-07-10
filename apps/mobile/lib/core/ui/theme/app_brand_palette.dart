import 'package:flutter/material.dart';

/// Official Servicios 180° brand palette — Sprint 2 (Branding & UX),
/// Etapa 1. Derived from `Logo oficial grupo.svg` (analyzed, never
/// added to the repository — see the Sprint 2 handoff for the color
/// extraction). Each color is a full 50–900 tonal scale; the "base"
/// stop noted in each comment is the one active tone would use in a
/// single (light) theme.
///
/// **Not wired into `AppTheme`/`ColorScheme` yet.** This file only
/// makes the official tokens available to compile against — applying
/// them across the app is a later Etapa of Sprint 2 (see
/// `PROJECT_STATUS.md`), not this one. `AppTheme.light` keeps using
/// the neutral placeholder palette (`AppColors` in `app_theme.dart`)
/// until that Etapa.
abstract final class AppBrandPalette {
  // ---------------------------------------------------------------
  // Primary — "Oro 180°". Traced to the logo's gold radial gradients
  // (terminal stop `#F0BF00`) and the "GRUPO EMPRESARIAL" wordmark
  // color (`#8E690D`), which becomes 900 exactly.
  // ---------------------------------------------------------------
  static const Color primary50 = Color(0xFFFEF9E7);
  static const Color primary100 = Color(0xFFFDF0C4);
  static const Color primary200 = Color(0xFFFBE59C);
  static const Color primary300 = Color(0xFFF8D970);
  static const Color primary400 = Color(0xFFF4CD4C);
  static const Color primary500 = Color(0xFFF0BF00); // base
  static const Color primary600 = Color(0xFFD6AB00);
  static const Color primary700 = Color(0xFFBC9600);
  static const Color primary800 = Color(0xFFA28200);
  static const Color primary900 = Color(0xFF8E690D); // logo wordmark color

  // ---------------------------------------------------------------
  // Secondary — "Plata 180°". Traced to the logo's grey/silver linear
  // gradient ("Plomo"): `#DADADA`/`#B2B2B2`/`#9D9D9C` are its exact
  // stops, reused here at 200/400/500.
  // ---------------------------------------------------------------
  static const Color secondary50 = Color(0xFFF7F7F7);
  static const Color secondary100 = Color(0xFFEDEDED);
  static const Color secondary200 = Color(0xFFDADADA); // gradient stop
  static const Color secondary300 = Color(0xFFC4C4C4);
  static const Color secondary400 = Color(0xFFB2B2B2); // gradient stop
  static const Color secondary500 = Color(0xFF9D9D9C); // base, gradient stop
  static const Color secondary600 = Color(0xFF868685);
  static const Color secondary700 = Color(0xFF6F6F6E);
  static const Color secondary800 = Color(0xFF575756);
  static const Color secondary900 = Color(0xFF3D3D3C);

  // ---------------------------------------------------------------
  // Accent — "Bronce 180°". A second, warmer gold used only for
  // secondary emphasis (selected chips, subtle highlights) so it
  // never competes with Primary as the main call-to-action color.
  // Traced to the logo's other gold gradient terminal stop
  // (`#C9961A`), reused here exactly at 500.
  // ---------------------------------------------------------------
  static const Color accent50 = Color(0xFFFBF3E3);
  static const Color accent100 = Color(0xFFF5E2BE);
  static const Color accent200 = Color(0xFFEDCE93);
  static const Color accent300 = Color(0xFFE4B968);
  static const Color accent400 = Color(0xFFD9A542);
  static const Color accent500 = Color(0xFFC9961A); // base, gradient stop
  static const Color accent600 = Color(0xFFAD8117);
  static const Color accent700 = Color(0xFF8F6B13);
  static const Color accent800 = Color(0xFF71540F);
  static const Color accent900 = Color(0xFF4F3B0A);

  // ---------------------------------------------------------------
  // Background — near-white, base at 50 (lightest stop): the app has
  // no dark theme yet, so 600–900 exist for completeness/future dark
  // mode but are not consumed anywhere today.
  // ---------------------------------------------------------------
  static const Color background50 = Color(0xFFFFFFFF); // base
  static const Color background100 = Color(0xFFFEFDFB);
  static const Color background200 = Color(0xFFFCFAF6);
  static const Color background300 = Color(0xFFF8F5EE);
  static const Color background400 = Color(0xFFF2EDE0);
  static const Color background500 = Color(0xFFE0D9C4);
  static const Color background600 = Color(0xFFB8AE8F);
  static const Color background700 = Color(0xFF8C8264);
  static const Color background800 = Color(0xFF5C5540);
  static const Color background900 = Color(0xFF2E2A20);

  // ---------------------------------------------------------------
  // Surface — warm ivory, base at 200 (one notch above pure white,
  // so cards read as a distinct layer against Background without a
  // cold grey cast — the deliberate departure from the old flat
  // `#F8F8F8` neutral surface).
  // ---------------------------------------------------------------
  static const Color surface50 = Color(0xFFFFFFFF);
  static const Color surface100 = Color(0xFFFDFBF7);
  static const Color surface200 = Color(0xFFFBF9F4); // base
  static const Color surface300 = Color(0xFFF6F2E9);
  static const Color surface400 = Color(0xFFF0EADC);
  static const Color surface500 = Color(0xFFE4DCC8);
  static const Color surface600 = Color(0xFFC9BFA3);
  static const Color surface700 = Color(0xFFA79C7C);
  static const Color surface800 = Color(0xFF766D52);
  static const Color surface900 = Color(0xFF423C2E);

  // ---------------------------------------------------------------
  // Error — kept anchored on the existing neutral-phase error red
  // (`#B00020`, now at 500) so the semantic meaning doesn't shift
  // when this palette is adopted in a later Etapa.
  // ---------------------------------------------------------------
  static const Color error50 = Color(0xFFFDE8EA);
  static const Color error100 = Color(0xFFF8C1C8);
  static const Color error200 = Color(0xFFF0919C);
  static const Color error300 = Color(0xFFE65F70);
  static const Color error400 = Color(0xFFDA3850);
  static const Color error500 = Color(0xFFB00020); // base, unchanged anchor
  static const Color error600 = Color(0xFF97001B);
  static const Color error700 = Color(0xFF7D0016);
  static const Color error800 = Color(0xFF630011);
  static const Color error900 = Color(0xFF3D000A);

  // ---------------------------------------------------------------
  // Success — an olive-leaning green (not a pure Material green) so
  // it harmonizes with the gold palette instead of clashing with it.
  // ---------------------------------------------------------------
  static const Color success50 = Color(0xFFEDF5E8);
  static const Color success100 = Color(0xFFD3E8C4);
  static const Color success200 = Color(0xFFB5D99C);
  static const Color success300 = Color(0xFF96C973);
  static const Color success400 = Color(0xFF7DBD54);
  static const Color success500 = Color(0xFF5FA739); // base
  static const Color success600 = Color(0xFF4F8C2F);
  static const Color success700 = Color(0xFF3F7126);
  static const Color success800 = Color(0xFF30561D);
  static const Color success900 = Color(0xFF1F3812);

  // ---------------------------------------------------------------
  // Warning — a distinct orange, deliberately far enough from
  // Primary's gold (`#F0BF00`) to never be confused with it in a
  // status badge.
  // ---------------------------------------------------------------
  static const Color warning50 = Color(0xFFFFF2E5);
  static const Color warning100 = Color(0xFFFFDDB8);
  static const Color warning200 = Color(0xFFFFC488);
  static const Color warning300 = Color(0xFFFFAB57);
  static const Color warning400 = Color(0xFFFF9633);
  static const Color warning500 = Color(0xFFF57C00); // base
  static const Color warning600 = Color(0xFFD66C00);
  static const Color warning700 = Color(0xFFB65C00);
  static const Color warning800 = Color(0xFF954B00);
  static const Color warning900 = Color(0xFF632F00);

  // ---------------------------------------------------------------
  // Info — a standard, professional blue with no counterpart in the
  // logo; kept intentionally neutral so it never competes with the
  // brand gold/silver/bronze trio.
  // ---------------------------------------------------------------
  static const Color info50 = Color(0xFFE8F1FB);
  static const Color info100 = Color(0xFFC4DDF5);
  static const Color info200 = Color(0xFF9CC7EE);
  static const Color info300 = Color(0xFF73B1E6);
  static const Color info400 = Color(0xFF549FE1);
  static const Color info500 = Color(0xFF2E8BDB); // base
  static const Color info600 = Color(0xFF2676BC);
  static const Color info700 = Color(0xFF1E609D);
  static const Color info800 = Color(0xFF164A7D);
  static const Color info900 = Color(0xFF0E3050);
}
