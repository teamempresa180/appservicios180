/// Centralized backend connection settings. The base URL is provided at
/// build/run time via `--dart-define=API_BASE_URL=...` — this default only
/// covers local development against the backend started per
/// `apps/backend/README.md` (`npm run start:dev`, port 3000).
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
