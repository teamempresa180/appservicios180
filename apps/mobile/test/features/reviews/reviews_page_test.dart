import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:mobile/core/ui/theme/app_theme.dart';
import 'package:mobile/core/ui/widgets/app_chip.dart';
import 'package:mobile/core/ui/widgets/app_empty_state.dart';
import 'package:mobile/core/ui/widgets/app_loading.dart';
import 'package:mobile/features/reviews/presentation/pages/reviews_page.dart';
import 'package:mobile/features/reviews/presentation/widgets/review_card.dart';
import 'package:mobile/features/reviews/presentation/widgets/review_filters.dart';
import 'package:mobile/features/reviews/presentation/widgets/reviews_summary.dart';
import 'package:mobile/features/reviews/repositories/mock_reviews_repository.dart';
import 'package:mobile/features/reviews/repositories/reviews_repository.dart';
import 'package:mobile/identity/models/identity_id.dart';
import 'package:mobile/order/entities/order.dart';
import 'package:mobile/order/models/order_id.dart';
import 'package:mobile/profiles/entities/profile.dart';
import 'package:mobile/provider/entities/provider.dart';
import 'package:mobile/provider/models/provider_id.dart';
import 'package:mobile/review/entities/review.dart';
import 'package:mobile/service/entities/service.dart';

/// Wraps [MockReviewsRepository] (already `Future`-returning) so tests
/// can force it to never resolve (loading state) or return an empty
/// list (empty state), without touching the real mock data.
class _FakeReviewsRepository implements ReviewsRepository {
  _FakeReviewsRepository({this.neverResolves = false, this.forceEmpty = false});

  final bool neverResolves;
  final bool forceEmpty;
  final _delegate = MockReviewsRepository();

  @override
  Future<List<Review>> getReviews() {
    if (neverResolves) return Completer<List<Review>>().future;
    if (forceEmpty) return Future.value(const []);
    return _delegate.getReviews();
  }

  @override
  Future<Provider> getProviderFor(Review review) =>
      _delegate.getProviderFor(review);

  @override
  Future<Profile> getProfileFor(Review review) =>
      _delegate.getProfileFor(review);

  @override
  Future<Order> getOrderFor(Review review) => _delegate.getOrderFor(review);

  @override
  Future<Service> getServiceFor(Review review) =>
      _delegate.getServiceFor(review);

  @override
  Future<Review> createReview({
    required OrderId orderId,
    required ProviderId providerId,
    required IdentityId reviewerIdentityId,
    required num rating,
    required String title,
    required String comment,
  }) => _delegate.createReview(
    orderId: orderId,
    providerId: providerId,
    reviewerIdentityId: reviewerIdentityId,
    rating: rating,
    title: title,
    comment: comment,
  );
}

void main() {
  Widget buildApp({ReviewsRepository? repository}) {
    return MaterialApp(
      theme: AppTheme.light,
      home: Scaffold(
        body: ReviewsPage(repository: repository ?? _FakeReviewsRepository()),
      ),
    );
  }

  testWidgets('shows the header', (tester) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.text('Reseñas'), findsOneWidget);
  });

  testWidgets('shows the six rating filters', (tester) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.byType(ReviewFilters), findsOneWidget);
    expect(find.widgetWithText(AppChip, 'Todas'), findsOneWidget);
    expect(find.widgetWithText(AppChip, '5★'), findsOneWidget);
    expect(find.widgetWithText(AppChip, '4★'), findsOneWidget);
    expect(find.widgetWithText(AppChip, '3★'), findsOneWidget);
    expect(find.widgetWithText(AppChip, '2★'), findsOneWidget);
    expect(find.widgetWithText(AppChip, '1★'), findsOneWidget);
  });

  testWidgets('selecting a filter only changes its visual selection', (
    tester,
  ) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    final chipBefore = tester.widget<AppChip>(
      find.widgetWithText(AppChip, '5★'),
    );
    expect(chipBefore.selected, isFalse);

    await tester.tap(find.text('5★'));
    await tester.pumpAndSettle();

    final chipAfter = tester.widget<AppChip>(
      find.widgetWithText(AppChip, '5★'),
    );
    expect(chipAfter.selected, isTrue);
    // The list is unaffected — still shows every mock review.
    expect(find.byType(ReviewCard), findsNWidgets(4));
  });

  testWidgets('shows the aggregate summary derived from every rating', (
    tester,
  ) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.byType(ReviewsSummary), findsOneWidget);
    // Average of 5, 4, 3, 1 = 3.25 -> 3.3
    expect(find.text('3.3'), findsOneWidget);
    expect(find.text('(4 reseñas)'), findsOneWidget);
  });

  testWidgets('list state shows every mock review with its comment', (
    tester,
  ) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.byType(ReviewCard), findsNWidgets(4));
    expect(find.text('Excelente trabajo'), findsOneWidget);
    expect(find.text('Muy buen servicio'), findsOneWidget);
    expect(find.text('Servicio aceptable'), findsOneWidget);
    expect(find.text('No quedé satisfecho'), findsOneWidget);
  });

  testWidgets('shows the edit-dependent action per review', (tester) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    // canEdit: review1=true, review2=true, review3=false, review4=false
    expect(find.text('Editar'), findsNWidgets(2));
    expect(find.text('Ver detalle'), findsNWidgets(2));
  });

  testWidgets('loading state shows AppLoading instead of the list', (
    tester,
  ) async {
    await tester.pumpWidget(
      buildApp(repository: _FakeReviewsRepository(neverResolves: true)),
    );
    // The indeterminate CircularProgressIndicator never settles, so
    // pumpAndSettle can't be used — but the message's FadeIn does need
    // a couple of pumps to resolve, or its delayed Future leaves a
    // dangling Timer at test teardown.
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 300));

    expect(find.byType(AppLoading), findsOneWidget);
    expect(find.byType(ReviewCard), findsNothing);
  });

  testWidgets('empty state shows AppEmptyState instead of the list', (
    tester,
  ) async {
    await tester.pumpWidget(
      buildApp(repository: _FakeReviewsRepository(forceEmpty: true)),
    );
    await tester.pumpAndSettle();

    expect(find.byType(AppEmptyState), findsOneWidget);
    expect(find.byType(ReviewCard), findsNothing);
  });

  testWidgets('does not build its own Scaffold', (tester) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.byType(Scaffold), findsOneWidget);
    expect(find.byType(AppBar), findsNothing);
  });
}
