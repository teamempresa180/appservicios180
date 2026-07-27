import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:mobile/availability/entities/availability.dart';
import 'package:mobile/category/entities/category.dart';
import 'package:mobile/core/network/http_exceptions.dart';
import 'package:mobile/core/ui/theme/app_theme.dart';
import 'package:mobile/core/ui/widgets/app_loading.dart';
import 'package:mobile/features/provider_profile/presentation/pages/provider_profile_page.dart';
import 'package:mobile/features/provider_profile/presentation/widgets/provider_availability.dart';
import 'package:mobile/features/provider_profile/presentation/widgets/provider_information.dart';
import 'package:mobile/features/provider_profile/presentation/widgets/provider_reviews_summary.dart';
import 'package:mobile/features/provider_profile/presentation/widgets/provider_services.dart';
import 'package:mobile/features/provider_profile/presentation/widgets/provider_specialties.dart';
import 'package:mobile/features/provider_profile/presentation/widgets/provider_statistics.dart';
import 'package:mobile/features/provider_profile/repositories/mock_provider_profile_repository.dart';
import 'package:mobile/features/provider_profile/repositories/provider_profile_repository.dart';
import 'package:mobile/profiles/entities/profile.dart';
import 'package:mobile/provider/entities/provider.dart';
import 'package:mobile/review/entities/review.dart';
import 'package:mobile/service/entities/service.dart';

/// Test double standing in for the real HTTP-backed repository — lets
/// each test control exactly what each getter returns/throws and when,
/// without touching the global service locator.
class _FakeProviderProfileRepository implements ProviderProfileRepository {
  _FakeProviderProfileRepository({
    this.neverResolves = false,
    this.forceError = false,
  });

  final bool neverResolves;
  final bool forceError;
  final _delegate = MockProviderProfileRepository();

  @override
  Future<Provider> getProvider() => _run(() => _delegate.getProvider());

  @override
  Future<Profile> getProfileFor(Provider provider) =>
      _run(() => _delegate.getProfileFor(provider));

  @override
  Future<Availability> getAvailabilityFor(Provider provider) =>
      _run(() => _delegate.getAvailabilityFor(provider));

  @override
  Future<List<Review>> getReviewsFor(Provider provider) =>
      _run(() => _delegate.getReviewsFor(provider));

  @override
  Future<List<Service>> getServicesFor(Provider provider) =>
      _run(() => _delegate.getServicesFor(provider));

  @override
  Future<List<Category>> getCategoriesFor(List<Service> services) =>
      _run(() => _delegate.getCategoriesFor(services));

  Future<T> _run<T>(Future<T> Function() delegateCall) {
    if (neverResolves) return Completer<T>().future;
    if (forceError) {
      return Future<T>.error(const NetworkHttpException('sin conexión'));
    }
    return delegateCall();
  }
}

void main() {
  Widget buildApp({ProviderProfileRepository? repository}) {
    return MaterialApp(
      theme: AppTheme.light,
      home: Scaffold(
        body: ProviderProfilePage(
          repository: repository ?? _FakeProviderProfileRepository(),
        ),
      ),
    );
  }

  testWidgets('shows the header with name and aggregate rating', (
    tester,
  ) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.text('Diana Restrepo'), findsOneWidget);
    // Average of 5, 4, 5, 4 = 4.5.
    expect(find.text('4.5'), findsWidgets);
    expect(find.text('(4 reseñas)'), findsOneWidget);
  });

  testWidgets('shows the about description', (tester) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.byType(ProviderInformation), findsOneWidget);
    expect(find.textContaining('Plomera independiente'), findsOneWidget);
  });

  testWidgets('shows experience, completed services and response time', (
    tester,
  ) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.byType(ProviderStatistics), findsOneWidget);
    expect(find.text('8'), findsOneWidget); // yearsOfExperience
    expect(find.text('47'), findsOneWidget); // completedServices
  });

  testWidgets('shows every specialty as a chip', (tester) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.byType(ProviderSpecialties), findsOneWidget);
    expect(find.text('Reparación de fugas'), findsOneWidget);
    // "Instalación de tuberías" is both a specialty chip and the name
    // of a published service further down, so it legitimately appears
    // twice on the page.
    expect(find.text('Instalación de tuberías'), findsNWidgets(2));
    expect(find.text('Mantenimiento preventivo'), findsOneWidget);
    expect(find.text('Grifería'), findsOneWidget);
  });

  testWidgets('shows every published service with its price', (tester) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.byType(ProviderServices), findsOneWidget);
    expect(find.text('Reparación de fuga de agua'), findsOneWidget);
    expect(find.text('Instalación de tuberías'), findsNWidgets(2));
    expect(find.text('Instalación de grifería'), findsOneWidget);
    expect(find.text('\$45'), findsOneWidget);
  });

  testWidgets('shows availability status and hours', (tester) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.byType(ProviderAvailability), findsOneWidget);
    expect(find.text('Disponible'), findsOneWidget);
    expect(find.text('08:00 - 18:00'), findsOneWidget);
  });

  testWidgets('shows the reviews summary with each review', (tester) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.byType(ProviderReviewsSummary), findsOneWidget);
    expect(find.text('Excelente trabajo'), findsOneWidget);
    expect(find.text('Muy buen servicio'), findsOneWidget);
    expect(find.text('Recomendada'), findsOneWidget);
    expect(find.text('Buena atención'), findsOneWidget);
  });

  testWidgets('shows both action buttons', (tester) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.text('Solicitar servicio'), findsOneWidget);
    expect(find.text('Chat'), findsOneWidget);
  });

  testWidgets('does not build its own Scaffold', (tester) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.byType(Scaffold), findsOneWidget);
    expect(find.byType(AppBar), findsNothing);
  });

  testWidgets('loading state shows AppLoading instead of the content', (
    tester,
  ) async {
    await tester.pumpWidget(
      buildApp(
        repository: _FakeProviderProfileRepository(neverResolves: true),
      ),
    );
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 300));

    expect(find.byType(AppLoading), findsOneWidget);
    expect(find.byType(ProviderInformation), findsNothing);
  });

  testWidgets('error state shows a retry action', (tester) async {
    await tester.pumpWidget(
      buildApp(repository: _FakeProviderProfileRepository(forceError: true)),
    );
    await tester.pumpAndSettle();

    expect(
      find.text('No se pudo cargar el perfil del proveedor'),
      findsOneWidget,
    );
    expect(find.text('Reintentar'), findsOneWidget);
  });
}
