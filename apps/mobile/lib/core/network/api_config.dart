/// Centralized backend connection settings. The base URL is never
/// hardcoded here — it's provided at build time via
/// `--dart-define=API_BASE_URL=...`, so switching between environments
/// never requires touching source code, only the build command:
///
/// - **Dev** (default, no flag needed): `http://localhost:3000` — a
///   backend started locally per `apps/backend/README.md`
///   (`npm run start:dev`).
/// - **Alpha** (real pilot, public backend):
///   `--dart-define=API_BASE_URL=https://<railway-app>.up.railway.app
///   --dart-define=USE_MOCK_BACKEND=false`
/// - **Production** (future): same mechanism, pointed at the
///   production backend's own URL once one exists.
///
/// Flutter's `--dart-define` is resolved at *compile* time (there is no
/// runtime `.env` for a shipped APK) — this is Flutter's standard,
/// documented mechanism for exactly this kind of per-build
/// configuration, so a URL change still means a rebuild, just never a
/// source-code change.
abstract final class ApiConfig {
  static const String baseUrl = String.fromEnvironment(
    'API_BASE_URL',
    defaultValue: 'http://localhost:3000',
  );

  /// When `true` (the current default), every repository resolves to its
  /// offline `Mock...` implementation instead of `Http...` — used while
  /// the UI is being redesigned, so it doesn't depend on a running
  /// backend. Reconnect with `--dart-define=USE_MOCK_BACKEND=false`.
  static const bool useMockBackend = bool.fromEnvironment(
    'USE_MOCK_BACKEND',
    defaultValue: true,
  );

  static const Duration connectTimeout = Duration(seconds: 10);
  static const Duration receiveTimeout = Duration(seconds: 15);
  static const Duration sendTimeout = Duration(seconds: 15);

  /// Resolves a relative path the backend returned for an uploaded file
  /// (e.g. `uploads/profiles/<id>/photo.jpg`, from `POST /profiles/:id/avatar`)
  /// into an absolute URL servable by `Image.network`/`NetworkImage`.
  /// Already-absolute URLs (or `data:` URIs, used by mock repositories)
  /// pass through unchanged.
  static String resolveUploadUrl(String path) {
    if (path.startsWith('http://') ||
        path.startsWith('https://') ||
        path.startsWith('data:')) {
      return path;
    }
    return '$baseUrl/$path';
  }
}
