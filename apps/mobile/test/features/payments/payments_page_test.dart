import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:mobile/core/network/http_exceptions.dart';
import 'package:mobile/core/ui/theme/app_theme.dart';
import 'package:mobile/core/ui/widgets/app_empty_state.dart';
import 'package:mobile/features/payments/presentation/pages/payments_page.dart';
import 'package:mobile/features/payments/presentation/widgets/payment_breakdown.dart';
import 'package:mobile/features/payments/presentation/widgets/payment_information.dart';
import 'package:mobile/features/payments/presentation/widgets/payment_loading.dart';
import 'package:mobile/features/payments/presentation/widgets/payment_method_card.dart';
import 'package:mobile/features/payments/presentation/widgets/payment_status_badge.dart';
import 'package:mobile/features/payments/presentation/widgets/payment_summary.dart';
import 'package:mobile/features/payments/repositories/mock_payments_repository.dart';
import 'package:mobile/features/payments/repositories/payments_repository.dart';
import 'package:mobile/order/entities/order.dart';
import 'package:mobile/payment/entities/payment.dart';
import 'package:mobile/profiles/entities/profile.dart';
import 'package:mobile/provider/entities/provider.dart';
import 'package:mobile/quote/entities/quote.dart';
import 'package:mobile/service/entities/service.dart';

/// Wraps [MockPaymentsRepository] (already `Future`-returning) so tests
/// can force it to never resolve (loading state) or throw (error
/// state), without touching the real mock data.
class _FakePaymentsRepository implements PaymentsRepository {
  _FakePaymentsRepository({this.neverResolves = false, this.throwError = false});

  final bool neverResolves;
  final bool throwError;
  final _delegate = MockPaymentsRepository();

  Future<T> _guard<T>(Future<T> Function() call) {
    if (neverResolves) return Completer<T>().future;
    if (throwError) {
      throw const NetworkHttpException('sin conexión');
    }
    return call();
  }

  @override
  Future<Payment> getPayment() => _guard(() => _delegate.getPayment());

  @override
  Future<Order> getOrder() => _guard(() => _delegate.getOrder());

  @override
  Future<Quote> getQuote() => _guard(() => _delegate.getQuote());

  @override
  Future<Service> getService() => _guard(() => _delegate.getService());

  @override
  Future<Provider> getProvider() => _guard(() => _delegate.getProvider());

  @override
  Future<Profile> getProfile() => _guard(() => _delegate.getProfile());
}

void main() {
  Widget buildApp({PaymentsRepository? repository}) {
    return MaterialApp(
      theme: AppTheme.light,
      home: Scaffold(
        body: PaymentsPage(repository: repository ?? _FakePaymentsRepository()),
      ),
    );
  }

  testWidgets('shows the header with the service name', (tester) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.text('Pago'), findsOneWidget);
    expect(find.text('Reparación de fuga de agua'), findsWidgets);
  });

  testWidgets('shows the payment information with provider', (tester) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.byType(PaymentInformation), findsOneWidget);
    expect(find.text('Diana Restrepo'), findsOneWidget);
    expect(find.text('8 años de experiencia'), findsOneWidget);
  });

  testWidgets('shows the real payment method', (tester) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.byType(PaymentMethodCard), findsOneWidget);
    expect(find.text('Tarjeta'), findsOneWidget);
  });

  testWidgets('shows the status badge derived from Payment.status', (
    tester,
  ) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.byType(PaymentStatusBadge), findsOneWidget);
    expect(find.text('Completado'), findsOneWidget);
  });

  testWidgets('shows the summary with reference and receipt', (tester) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.byType(PaymentSummary), findsOneWidget);
    expect(find.text('TRX-2026-000123'), findsOneWidget);
    expect(find.text('REC-000456'), findsOneWidget);
  });

  testWidgets('shows the real total from Payment.amount', (tester) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.byType(PaymentBreakdown), findsOneWidget);
    expect(find.text('\$45.00'), findsOneWidget);
  });

  testWidgets('shows the status-dependent action for a completed payment', (
    tester,
  ) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.text('Ver recibo'), findsOneWidget);
  });

  testWidgets('loading state shows AppLoading instead of the information', (
    tester,
  ) async {
    await tester.pumpWidget(
      buildApp(repository: _FakePaymentsRepository(neverResolves: true)),
    );
    // The indeterminate CircularProgressIndicator never settles, so
    // pumpAndSettle can't be used — but the message's FadeIn does need
    // a couple of pumps to resolve, or its delayed Future leaves a
    // dangling Timer at test teardown.
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 300));

    expect(find.byType(PaymentLoading), findsOneWidget);
    expect(find.byType(PaymentInformation), findsNothing);
  });

  testWidgets('error state shows AppEmptyState instead of the information', (
    tester,
  ) async {
    await tester.pumpWidget(
      buildApp(repository: _FakePaymentsRepository(throwError: true)),
    );
    await tester.pumpAndSettle();

    expect(find.byType(AppEmptyState), findsOneWidget);
    expect(find.byType(PaymentInformation), findsNothing);
  });

  testWidgets('does not build its own Scaffold', (tester) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.byType(Scaffold), findsOneWidget);
    expect(find.byType(AppBar), findsNothing);
  });
}
