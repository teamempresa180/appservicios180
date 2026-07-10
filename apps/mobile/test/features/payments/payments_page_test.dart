import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:mobile/core/ui/theme/app_theme.dart';
import 'package:mobile/core/ui/widgets/app_empty_state.dart';
import 'package:mobile/core/ui/widgets/app_loading.dart';
import 'package:mobile/features/payments/presentation/pages/payments_page.dart';
import 'package:mobile/features/payments/presentation/widgets/payment_breakdown.dart';
import 'package:mobile/features/payments/presentation/widgets/payment_information.dart';
import 'package:mobile/features/payments/presentation/widgets/payment_method_card.dart';
import 'package:mobile/features/payments/presentation/widgets/payment_status_badge.dart';
import 'package:mobile/features/payments/presentation/widgets/payment_summary.dart';

void main() {
  Widget buildApp({PaymentsViewState state = PaymentsViewState.information}) {
    return MaterialApp(
      theme: AppTheme.light,
      home: Scaffold(body: PaymentsPage(state: state)),
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
    await tester.pumpWidget(buildApp(state: PaymentsViewState.loading));
    // The indeterminate CircularProgressIndicator never settles, so
    // pumpAndSettle can't be used — but the message's FadeIn does need
    // a couple of pumps to resolve, or its delayed Future leaves a
    // dangling Timer at test teardown.
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 300));

    expect(find.byType(AppLoading), findsOneWidget);
    expect(find.byType(PaymentInformation), findsNothing);
  });

  testWidgets('empty state shows AppEmptyState instead of the information', (
    tester,
  ) async {
    await tester.pumpWidget(buildApp(state: PaymentsViewState.empty));
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
