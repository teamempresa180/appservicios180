import 'dart:convert';

import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'become_provider_draft.dart';

/// Persists the in-progress provider-application draft (see
/// `BecomeProviderDraft`) across app restarts — same pattern as
/// `UserRoleStorage`/`ThemeModeStorage`: `flutter_secure_storage`, one
/// key, read/save. The value is a JSON blob rather than a single
/// primitive since the draft has several fields, but the storage shape
/// (construct with an injectable `FlutterSecureStorage`, `read`/`save`)
/// is identical.
class BecomeProviderDraftStorage {
  BecomeProviderDraftStorage({FlutterSecureStorage? storage})
    : _storage = storage ?? const FlutterSecureStorage();

  final FlutterSecureStorage _storage;

  static const _key = 'become_provider.draft';

  Future<BecomeProviderDraft?> read() async {
    final value = await _storage.read(key: _key);
    if (value == null) return null;
    try {
      return BecomeProviderDraft.fromJson(
        jsonDecode(value) as Map<String, dynamic>,
      );
    } catch (_) {
      // Corrupt/incompatible draft (e.g. left over from an older app
      // version) — fail open into a fresh wizard rather than blocking
      // the applicant on unreadable local state.
      return null;
    }
  }

  Future<void> save(BecomeProviderDraft draft) =>
      _storage.write(key: _key, value: jsonEncode(draft.toJson()));

  /// Called once the application is actually submitted (Paso 5) or a
  /// returning applicant is shown their real status instead — the
  /// draft has no purpose once there's a real `Provider` record.
  Future<void> clear() => _storage.delete(key: _key);
}
