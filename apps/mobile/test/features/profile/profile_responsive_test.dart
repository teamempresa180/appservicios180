import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:mobile/core/session/mock_auth_repository.dart';
import 'package:mobile/core/session/session_manager.dart';
import 'package:mobile/core/storage/secure_token_storage.dart';
import 'package:mobile/core/ui/theme/app_theme.dart';
import 'package:mobile/features/profile/presentation/pages/profile_page.dart';
import 'package:mobile/features/profile/repositories/mock_profile_repository.dart';

class _FakeSecureTokenStorage implements SecureTokenStorage {
  @override
  Future<void> save({
    required String accessToken,
    required String refreshToken,
  }) async {}

  @override
  Future<String?> readAccessToken() async => null;

  @override
  Future<String?> readRefreshToken() async => null;

  @override
  Future<void> clear() async {}
}

void main() {
  const widths = [320.0, 360.0, 390.0, 412.0, 768.0, 1024.0, 1440.0];

  Future<void> setSurfaceSize(WidgetTester tester, double width) async {
    final size = Size(width, 1200);
    await tester.binding.setSurfaceSize(size);
    tester.view.physicalSize = size;
    tester.view.devicePixelRatio = 1.0;
    addTearDown(() {
      tester.view.resetPhysicalSize();
      tester.view.resetDevicePixelRatio();
    });
  }

  for (final width in widths) {
    testWidgets('Profile has no overflow at ${width}px', (tester) async {
      await setSurfaceSize(tester, width);
      final sessionManager = SessionManager(
        authRepository: MockAuthRepository(),
        tokenStorage: _FakeSecureTokenStorage(),
      );
      await tester.pumpWidget(
        MaterialApp(
          theme: AppTheme.light,
          home: Scaffold(
            body: ProfilePage(
              repository: MockProfileRepository(),
              sessionManager: sessionManager,
            ),
          ),
        ),
      );
      await tester.pumpAndSettle();

      expect(tester.takeException(), isNull);
    });
  }
}
