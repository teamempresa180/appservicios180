/// Official image/placeholder size scale — Sprint 2 (Branding & UX),
/// Etapa 1. Rationalizes the ad hoc dimensions the visual audit found
/// scattered across features (96/104/120/128/152/160/168/180/220px,
/// each picked independently with no shared token) into one scale.
///
/// **Not retrofitted into existing screens yet** — adopting it in
/// `marketplace`/`service_detail`/`provider_profile`/`verification`/
/// `request_service` (the files the audit flagged) is layout-adjacent
/// work reserved for a later Sprint 2 Etapa, not this one.
abstract final class AppImageSize {
  static const double xs = 64;
  static const double sm = 96;
  static const double md = 120;
  static const double lg = 160;
  static const double xl = 200;
  static const double xxl = 240;
}
