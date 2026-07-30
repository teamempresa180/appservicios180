import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:mobile/core/ui/theme/app_theme.dart';
import 'package:mobile/features/provider_dashboard/mock/mock_provider_dashboard_data.dart';
import 'package:mobile/features/provider_dashboard/presentation/pages/provider_dashboard_page.dart';
import 'package:mobile/features/provider_dashboard/repositories/mock_provider_dashboard_repository.dart';
import 'package:mobile/provider/entities/provider.dart';
import 'package:mobile/provider/models/provider_status.dart';

/// Wraps [MockProviderDashboardRepository] but reports a non-`active`
/// [ProviderStatus] — used to confirm the dashboard shows a status
/// message instead of the full (start/complete-service, quotes,
/// earnings) UI for an account that isn't actually an active provider
/// yet, since every one of those actions would fail against the real
/// backend for such an account (see `login.use-case.ts`: only Active
/// grants the Provider role/endpoints).
class _NonActiveProviderRepository extends MockProviderDashboardRepository {
  _NonActiveProviderRepository(this.status);

  final ProviderStatus status;

  @override
  Future<Provider> getProvider() async => Provider(
    id: mockDashboardProvider.id,
    identityId: mockDashboardProvider.identityId,
    providerProfileId: mockDashboardProvider.providerProfileId,
    status: status,
    type: mockDashboardProvider.type,
    experience: mockDashboardProvider.experience,
    biography: mockDashboardProvider.biography,
    yearsOfExperience: mockDashboardProvider.yearsOfExperience,
    createdAt: mockDashboardProvider.createdAt,
    updatedAt: mockDashboardProvider.updatedAt,
  );
}

void main() {
  Widget buildApp(ProviderStatus status) {
    return MaterialApp(
      theme: AppTheme.light,
      home: Scaffold(
        body: ProviderDashboardPage(
          repository: _NonActiveProviderRepository(status),
        ),
      ),
    );
  }

  testWidgets(
    'a Pendiente provider sees a status message, not the full dashboard',
    (tester) async {
      await tester.pumpWidget(buildApp(ProviderStatus.pending));
      await tester.pumpAndSettle();

      expect(find.text('Solicitud enviada'), findsOneWidget);
      expect(find.text('Marcar como finalizado'), findsNothing);
    },
  );

  testWidgets(
    'a Rechazado provider sees a rejection message, not the full dashboard',
    (tester) async {
      await tester.pumpWidget(buildApp(ProviderStatus.rejected));
      await tester.pumpAndSettle();

      expect(find.text('Solicitud rechazada'), findsOneWidget);
    },
  );

  testWidgets(
    'a Suspendido provider sees a suspension message, not the full dashboard',
    (tester) async {
      await tester.pumpWidget(buildApp(ProviderStatus.suspended));
      await tester.pumpAndSettle();

      expect(find.text('Cuenta suspendida'), findsOneWidget);
    },
  );
}
