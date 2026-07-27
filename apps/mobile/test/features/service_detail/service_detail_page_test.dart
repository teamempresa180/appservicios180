import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:mobile/category/entities/category.dart';
import 'package:mobile/core/network/http_exceptions.dart';
import 'package:mobile/core/ui/theme/app_theme.dart';
import 'package:mobile/features/service_detail/presentation/pages/service_detail_page.dart';
import 'package:mobile/features/service_detail/presentation/widgets/provider_information.dart';
import 'package:mobile/features/service_detail/presentation/widgets/rating_summary.dart';
import 'package:mobile/features/service_detail/presentation/widgets/service_gallery.dart';
import 'package:mobile/features/service_detail/presentation/widgets/service_information.dart';
import 'package:mobile/features/service_detail/repositories/mock_service_detail_repository.dart';
import 'package:mobile/features/service_detail/repositories/service_detail_repository.dart';
import 'package:mobile/profiles/entities/profile.dart';
import 'package:mobile/provider/entities/provider.dart';
import 'package:mobile/review/entities/review.dart';
import 'package:mobile/service/entities/service.dart';

/// Test double standing in for the real HTTP-backed repository — lets
/// each test control loading/error states, without touching the global
/// service locator.
class _FakeServiceDetailRepository implements ServiceDetailRepository {
  _FakeServiceDetailRepository({
    this.neverResolves = false,
    this.forceError = false,
  });

  final bool neverResolves;
  final bool forceError;
  final _delegate = MockServiceDetailRepository();

  @override
  Future<Service> getService() {
    if (neverResolves) return Completer<Service>().future;
    if (forceError) throw const NetworkHttpException('sin conexión');
    return _delegate.getService();
  }

  @override
  Future<Provider> getProviderFor(Service service) {
    if (neverResolves) return Completer<Provider>().future;
    if (forceError) throw const NetworkHttpException('sin conexión');
    return _delegate.getProviderFor(service);
  }

  @override
  Future<Profile> getProviderProfileFor(Provider provider) {
    if (neverResolves) return Completer<Profile>().future;
    if (forceError) throw const NetworkHttpException('sin conexión');
    return _delegate.getProviderProfileFor(provider);
  }

  @override
  Future<Category> getCategoryFor(Service service) {
    if (neverResolves) return Completer<Category>().future;
    if (forceError) throw const NetworkHttpException('sin conexión');
    return _delegate.getCategoryFor(service);
  }

  @override
  Future<List<Review>> getReviewsFor(Service service) {
    if (neverResolves) return Completer<List<Review>>().future;
    if (forceError) throw const NetworkHttpException('sin conexión');
    return _delegate.getReviewsFor(service);
  }
}

void main() {
  Widget buildApp({ServiceDetailRepository? repository}) {
    return MaterialApp(
      theme: AppTheme.light,
      home: Scaffold(
        body: ServiceDetailPage(
          repository: repository ?? _FakeServiceDetailRepository(),
        ),
      ),
    );
  }

  testWidgets('shows the header with service name and category', (
    tester,
  ) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.text('Reparación de fuga de agua'), findsOneWidget);
    expect(find.text('Plomería'), findsOneWidget);
  });

  testWidgets('shows the simulated gallery', (tester) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.byType(ServiceGallery), findsOneWidget);
    expect(find.text('Imagen principal'), findsOneWidget);
    expect(find.text('Resultado final'), findsOneWidget);
  });

  testWidgets('shows the long description and base price', (tester) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.byType(ServiceInformation), findsOneWidget);
    expect(find.textContaining('Servicio profesional'), findsOneWidget);
    expect(find.text('\$45'), findsOneWidget);
  });

  testWidgets('shows the provider name and biography', (tester) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.byType(ProviderInformation), findsOneWidget);
    expect(find.text('Diana Restrepo'), findsOneWidget);
    expect(find.text('8 años de experiencia'), findsOneWidget);
  });

  testWidgets('shows the aggregate rating, reviews count and each review', (
    tester,
  ) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.byType(RatingSummary), findsOneWidget);
    expect(find.text('3 reseñas'), findsOneWidget);
    // Average of 5, 4, 5 = 4.7 (rounded to one decimal).
    expect(find.text('4.7'), findsOneWidget);
    expect(find.text('Excelente trabajo'), findsOneWidget);
    expect(find.text('Muy buen servicio'), findsOneWidget);
    expect(find.text('Recomendado'), findsOneWidget);
  });

  testWidgets('shows the "Solicitar servicio" button', (tester) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.text('Solicitar servicio'), findsOneWidget);
  });

  testWidgets('loading state shows AppLoading instead of the content', (
    tester,
  ) async {
    await tester.pumpWidget(
      buildApp(repository: _FakeServiceDetailRepository(neverResolves: true)),
    );
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 300));

    expect(find.text('Cargando servicio...'), findsOneWidget);
    expect(find.byType(ServiceGallery), findsNothing);
  });

  testWidgets('error state shows a retry action', (tester) async {
    await tester.pumpWidget(
      buildApp(repository: _FakeServiceDetailRepository(forceError: true)),
    );
    await tester.pumpAndSettle();

    expect(find.text('No se pudo cargar el servicio'), findsOneWidget);
    expect(find.text('Reintentar'), findsOneWidget);
  });

  testWidgets('does not build its own Scaffold', (tester) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.byType(Scaffold), findsOneWidget);
    expect(find.byType(AppBar), findsNothing);
  });
}
