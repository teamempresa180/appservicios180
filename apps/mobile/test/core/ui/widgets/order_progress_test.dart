import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mobile/core/ui/theme/app_theme.dart';
import 'package:mobile/core/ui/widgets/order_progress.dart';
import 'package:mobile/order/journey/order_journey_stage.dart';

void main() {
  Widget buildApp(Widget child) {
    return MaterialApp(
      theme: AppTheme.light,
      home: Scaffold(body: child),
    );
  }

  const stages = [
    OrderJourneyStage.requested,
    OrderJourneyStage.awaitingQuotes,
    OrderJourneyStage.quotesReceived,
    OrderJourneyStage.accepted,
  ];

  testWidgets('renders every stage label', (tester) async {
    await tester.pumpWidget(
      buildApp(
        const OrderProgress(
          stages: stages,
          current: OrderJourneyStage.awaitingQuotes,
        ),
      ),
    );

    for (final stage in stages) {
      expect(find.text(stage.shortLabel), findsOneWidget);
    }
  });

  testWidgets('shows a check icon for stages before the current one', (tester) async {
    await tester.pumpWidget(
      buildApp(
        const OrderProgress(
          stages: stages,
          current: OrderJourneyStage.accepted,
        ),
      ),
    );

    expect(find.byIcon(Icons.check), findsNWidgets(3));
  });

  testWidgets('cancelled renders a banner instead of the timeline', (tester) async {
    await tester.pumpWidget(
      buildApp(
        const OrderProgress(
          stages: stages,
          current: OrderJourneyStage.awaitingQuotes,
          cancelled: true,
          cancelledLabel: 'Solicitud cancelada',
        ),
      ),
    );

    expect(find.text('Solicitud cancelada'), findsOneWidget);
    for (final stage in stages) {
      expect(find.text(stage.shortLabel), findsNothing);
    }
  });
}
