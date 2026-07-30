import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';

import 'package:mobile/core/ui/theme/app_theme.dart';
import 'package:mobile/core/ui/widgets/order_progress.dart';
import 'package:mobile/features/tracking/models/tracking_update.dart';
import 'package:mobile/features/tracking/presentation/widgets/tracking_info_panel.dart';
import 'package:mobile/order/journey/order_journey_info.dart';
import 'package:mobile/order/journey/order_journey_stage.dart';

void main() {
  const update = TrackingUpdate(
    providerPosition: LatLng(4.710, -74.072),
    destination: LatLng(4.711, -74.070),
    etaMinutes: 5,
    distanceMeters: 850,
    hasArrived: false,
  );

  const journey = OrderJourneyInfo(
    stage: OrderJourneyStage.inProgress,
    title: 'Servicio en progreso',
    description: 'El proveedor está realizando el trabajo en este momento.',
    helpMessage: '',
    actions: [],
  );

  Widget buildPanel({OrderJourneyInfo journeyInfo = journey}) {
    return MaterialApp(
      theme: AppTheme.light,
      home: Scaffold(
        body: TrackingInfoPanel(
          update: update,
          otherPartyName: 'Carlos Provider',
          otherPartyLabel: 'Tu proveedor',
          journey: journeyInfo,
        ),
      ),
    );
  }

  testWidgets('shows the order journey timeline instead of only ETA', (
    tester,
  ) async {
    await tester.pumpWidget(buildPanel());
    await tester.pumpAndSettle();

    // The shared OrderProgress timeline is rendered with every stage,
    // not just an ad-hoc ETA/status readout.
    expect(find.byType(OrderProgress), findsOneWidget);
    for (final stage in OrderJourneyStage.values) {
      expect(find.text(stage.shortLabel), findsOneWidget);
    }
    // ETA-specific info from the tracking update is still shown.
    expect(find.text('Llega en 5 min'), findsOneWidget);
  });

  testWidgets('shows a cancelled banner instead of the timeline when the '
      'order journey is cancelled', (tester) async {
    const cancelledJourney = OrderJourneyInfo(
      stage: OrderJourneyStage.requested,
      title: 'Solicitud cancelada',
      description: 'Cancelaste esta solicitud.',
      helpMessage: '',
      actions: [],
      cancelled: true,
    );
    await tester.pumpWidget(buildPanel(journeyInfo: cancelledJourney));
    await tester.pumpAndSettle();

    expect(find.text('Cancelado'), findsOneWidget);
    expect(find.text(OrderJourneyStage.inProgress.shortLabel), findsNothing);
  });

  testWidgets('no overflow at 320px wide', (tester) async {
    final size = const Size(320, 1000);
    await tester.binding.setSurfaceSize(size);
    tester.view.physicalSize = size;
    tester.view.devicePixelRatio = 1.0;
    addTearDown(() {
      tester.view.resetPhysicalSize();
      tester.view.resetDevicePixelRatio();
    });

    await tester.pumpWidget(buildPanel());
    await tester.pumpAndSettle();

    expect(tester.takeException(), isNull);
  });
}
