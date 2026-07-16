import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:mobile/category/entities/category.dart';
import 'package:mobile/core/network/http_exceptions.dart';
import 'package:mobile/core/ui/theme/app_theme.dart';
import 'package:mobile/core/ui/widgets/app_empty_state.dart';
import 'package:mobile/core/ui/widgets/app_loading.dart';
import 'package:mobile/features/provider_services/presentation/pages/provider_services_page.dart';
import 'package:mobile/features/provider_services/presentation/widgets/service_card.dart';
import 'package:mobile/features/provider_services/presentation/widgets/services_statistics.dart';
import 'package:mobile/features/provider_services/repositories/mock_provider_services_repository.dart';
import 'package:mobile/features/provider_services/repositories/provider_services_repository.dart';
import 'package:mobile/profiles/entities/profile.dart';
import 'package:mobile/provider/entities/provider.dart';
import 'package:mobile/service/entities/service.dart';

/// Wraps [MockProviderServicesRepository] (already `Future`-returning)
/// so tests can force it to never resolve (loading state) or return an
/// empty list (empty state), without touching the real mock data.
class _FakeProviderServicesRepository implements ProviderServicesRepository {
  _FakeProviderServicesRepository({
    this.neverResolves = false,
    this.forceEmpty = false,
    this.forceError = false,
  });

  final bool neverResolves;
  final bool forceEmpty;
  final bool forceError;
  final _delegate = MockProviderServicesRepository();

  @override
  Future<Provider> getProvider() async {
    if (neverResolves) return Completer<Provider>().future;
    if (forceError) {
      throw const NetworkHttpException('sin conexión');
    }
    return _delegate.getProvider();
  }

  @override
  Future<Profile> getProfile() => _delegate.getProfile();

  @override
  Future<List<Service>> getServices() {
    if (forceEmpty) return Future.value(const []);
    return _delegate.getServices();
  }

  @override
  Future<Category> getCategoryFor(Service service) =>
      _delegate.getCategoryFor(service);
}

void main() {
  Widget buildApp({ProviderServicesRepository? repository}) {
    return MaterialApp(
      theme: AppTheme.light,
      home: Scaffold(
        body: ProviderServicesPage(
          repository: repository ?? _FakeProviderServicesRepository(),
        ),
      ),
    );
  }

  testWidgets('shows the header', (tester) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.text('Mis servicios'), findsOneWidget);
  });

  testWidgets('shows statistics derived from the real services', (
    tester,
  ) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.byType(ServicesStatistics), findsOneWidget);
    // 2 active, 1 paused (inactive), 1 archived.
    expect(find.text('2'), findsWidgets);
    expect(find.text('1'), findsWidgets);
  });

  testWidgets('shows the add-service button', (tester) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.text('Nuevo servicio'), findsOneWidget);
  });

  testWidgets('shows every mock service with its category and price', (
    tester,
  ) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.byType(ServiceCard), findsNWidgets(4));
    expect(find.text('Reparación de fuga de agua'), findsOneWidget);
    expect(find.text('Plomería'), findsWidgets);
    expect(find.text('\$45'), findsOneWidget);
  });

  testWidgets('shows the status-derived badge per service', (tester) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.text('Activo'), findsNWidgets(2));
    expect(find.text('Pausado'), findsOneWidget);
    expect(find.text('Archivado'), findsOneWidget);
  });

  testWidgets('shows edit/pause/delete actions for every service', (
    tester,
  ) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.text('Editar'), findsNWidgets(4));
    expect(find.text('Pausar'), findsNWidgets(4));
    expect(find.text('Eliminar'), findsNWidgets(4));
  });

  testWidgets('loading state shows AppLoading instead of the list', (
    tester,
  ) async {
    await tester.pumpWidget(
      buildApp(repository: _FakeProviderServicesRepository(neverResolves: true)),
    );
    // The indeterminate CircularProgressIndicator never settles, so
    // pumpAndSettle can't be used — but the message's FadeIn does need
    // a couple of pumps to resolve, or its delayed Future leaves a
    // dangling Timer at test teardown.
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 300));

    expect(find.byType(AppLoading), findsOneWidget);
    expect(find.byType(ServiceCard), findsNothing);
  });

  testWidgets('empty state shows AppEmptyState instead of the list', (
    tester,
  ) async {
    await tester.pumpWidget(
      buildApp(repository: _FakeProviderServicesRepository(forceEmpty: true)),
    );
    await tester.pumpAndSettle();

    expect(find.byType(AppEmptyState), findsOneWidget);
    expect(find.byType(ServiceCard), findsNothing);
  });

  testWidgets('error state shows a retry action', (tester) async {
    await tester.pumpWidget(
      buildApp(repository: _FakeProviderServicesRepository(forceError: true)),
    );
    await tester.pumpAndSettle();

    expect(find.text('No se pudieron cargar los servicios'), findsOneWidget);
    expect(find.text('Reintentar'), findsOneWidget);
  });

  testWidgets('does not build its own Scaffold', (tester) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.byType(Scaffold), findsOneWidget);
    expect(find.byType(AppBar), findsNothing);
  });
}
